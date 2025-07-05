import { auth, db } from "@/lib/firebase";
import { useRef } from "react";

async function createOrGetRoom(selectedUser: any) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not logged in");

  const uidA = currentUser.uid;
  const uidB = selectedUser.uid;
  const roomId = [uidA, uidB].sort().join("_");

  return roomId;
}

export function Contact({ children, onSelectRoom, contacts }: any) {
  const handleClick = async (user: any) => {
    const roomId = await createOrGetRoom(user);
    onSelectRoom(roomId);
  };

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
          {contacts.map((contact) => (
            <li
              key={contact.uid}
              className="list-row hover:bg-base-200 active:bg-base-300 cursor-pointer"
              onClick={() => handleClick(contact)}
            >
              <div>
                <img
                  className="size-10 rounded-box"
                  src={contact.photoURL}
                  alt={contact.name}
                />
              </div>
              <div>
                <div>{contact.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {contact.status || "No status"}
                </div>
              </div>
            </li>
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
