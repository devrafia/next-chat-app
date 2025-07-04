import { auth, db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

async function createOrGetRoom(selectedUser: any) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not logged in");

  const uidA = currentUser.uid;
  const uidB = selectedUser.uid;

  const roomId = [uidA, uidB].sort().join("_");
  await setDoc(
    doc(db, "rooms", roomId),
    {
      participants: [uidA, uidB],
      userInfo: {
        [uidA]: {
          name: currentUser.displayName,
          photoURL: currentUser.photoURL,
          email: currentUser.email,
        },
        [uidB]: {
          name: selectedUser.name,
          photoURL: selectedUser.photoURL,
          email: selectedUser.email,
        },
      },
    },
    { merge: true }
  );

  return roomId;
}

export function Contact({ onSelectRoom }: any) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const snapshot = await getDocs(collection(db, "users"));
      setUsers(snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() })));
    }
    fetchUsers();
  }, []);

  const handleClick = async (user: any) => {
    const roomId = await createOrGetRoom(user);
    onSelectRoom(roomId);
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

        <div className="absolute bottom-0 right-0 bg-primary w-12 h-12 rounded-full flex justify-center items-center cursor-pointer m-4">
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
      </section>
    </>
  );
}
