import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { userInfo } from "os";
import { useEffect, useRef, useState } from "react";

async function createOrGetRoom(selectedUser: any) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not logged in");

  const uidA = currentUser.uid;
  const uidB = selectedUser.uid;
  const roomId = [uidA, uidB].sort().join("_");

  return roomId;
}

export function Contact({ children, onSelectRoom }: any) {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setUsers([]);
        return;
      }

      const q = query(
        collection(db, "rooms"),
        where("participants", "array-contains", user.uid),
        where("hasMessages", "==", true)
      );

      const unsubscribeRooms = onSnapshot(q, (snapshot) => {
        const contactList = snapshot.docs
          .map((doc) => {
            const userInfo = doc.data().userInfo;
            const contactId = Object.keys(userInfo).find(
              (uid) => uid !== user.uid
            );
            if (!contactId) return null;

            return {
              uid: contactId,
              user: userInfo[contactId],
            };
          })
          .filter(Boolean);

        setUsers(
          contactList.map((c) => ({
            uid: c!.uid,
            ...c!.user,
          }))
        );
      });
      return () => unsubscribeRooms();
    });

    return () => unsubscribe();
  }, []);

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
          {users.map((user) => (
            <li
              key={user.uid}
              className="list-row hover:bg-base-200 active:bg-base-300 cursor-pointer"
              onClick={() => handleClick(user)}
            >
              <div>
                <img
                  className="size-10 rounded-box"
                  src={user.photoURL}
                  alt={user.name}
                />
              </div>
              <div>
                <div>{user.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {user.status || "No status"}
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
