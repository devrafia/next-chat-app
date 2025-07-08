import { auth, database, db } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import { collection, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

async function createOrGetRoom(selectedUser: any, setSelectedContact: any) {
  const currentUser = auth.currentUser;

  if (!currentUser) throw new Error("User not logged in");

  const uidA = currentUser.uid;
  const uidB = selectedUser.uid;
  const roomId = [uidA, uidB].sort().join("_");

  return roomId;
}

function getUserStatus(uid) {
  type Status = "online" | "offline";
  const [status, setStatus] = useState<Status>("offline");

  useEffect(() => {
    const statusRef = ref(database, "status/" + uid);
    return onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      setStatus(data?.state || "offline");
    });
  }, [uid]);

  return status;
}

export function Contact({ children, setRoomId, contacts }: any) {
  const [selectedContact, setSelectedContact] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
    modal?.showModal();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  return (
    <>
      <section className="relative flex-[0_0_33%] bg-slate-700">
        <ul className="list bg-base-100 rounded-box shadow-md">
          {contacts.map((contact: any) => (
            <ContactItem
              key={contact.uid}
              contact={contact}
              setRoomId={setRoomId}
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
            />
          ))}
        </ul>

        <div
          onClick={handleOpen}
          className="absolute bottom-0 right-0 bg-primary w-12 h-12 rounded-full flex justify-center items-center cursor-pointer m-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        {children(inputRef)}
      </section>
    </>
  );
}

function ContactItem({
  contact,
  setRoomId,
  selectedContact,
  setSelectedContact,
}) {
  const handleClick = async (user: any) => {
    const selectedUser = user;
    setSelectedContact(selectedUser.uid);
    const roomId = await createOrGetRoom(selectedUser, setSelectedContact);
    contact.unreadMessages = 0;
    setRoomId(roomId);
  };

  const status = getUserStatus(contact.uid);

  return (
    <>
      <li
        key={contact.uid}
        className={`list-row cursor-pointer rounded-none transition-all duration-150 ${
          selectedContact == contact.uid ? "bg-secondary" : "hover:bg-base-200"
        }`}
        onClick={() => handleClick(contact)}
      >
        <div>
          <img
            className="size-10 rounded-box border-2 border-white"
            src={contact.photoURL}
            alt={contact.name}
          />
        </div>
        <div>
          <div>{contact.name}</div>
          <div
            className={`text-xs uppercase font-bold transition-all duration-1000 w-max rounded-lg ${
              status == "online" ? "text-white bg-green-500 p-1" : ""
            }`}
          >
            {status || "No status"}
          </div>
        </div>
        {contact.unreadMessages > 0 ? (
          <div className="flex items-center justify-center bg-primary rounded-sm aspect-square">
            <span>{contact.unreadMessages}</span>
          </div>
        ) : (
          ""
        )}
      </li>
    </>
  );
}
