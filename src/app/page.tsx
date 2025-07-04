"use client";
import Image from "next/image";
import { auth, db, provider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

async function createOrGetRoom(selectedUser: any) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not logged in");

  const uidA = currentUser.uid;
  const uidB = selectedUser.uid;

  const roomId = [uidA, uidB].sort().join("_");

  // Buat dokumen room jika belum ada
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

export function useMessages(roomId: any) {
  const [roomData, setRoomData] = useState(null);
  const [messages, setMessages] = useState<any[]>([]);

  const roomRef = doc(db, "rooms", roomId);
  onSnapshot(roomRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      setRoomData(docSnapshot.data().userInfo);
    }
  });

  useEffect(() => {
    const q = query(
      collection(db, `rooms/${roomId}/messages`),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(docs);
    });
    return () => unsubscribe();
  }, [roomId]);

  return { roomData, messages };
}

export default function Home() {
  const [roomId, setRoomId] = useState("s");
  return (
    <>
      <Navbar />
      <main>
        <div className="flex flex-1 h-[calc(100vh-64px)]">
          <ContactList onSelectRoom={setRoomId} />
          <Chat roomId={roomId}>
            <ChatInput roomId={roomId} />
          </Chat>
        </div>
      </main>
    </>
  );
}

export function Navbar() {
  return (
    <>
      <header>
        <nav>
          <div className="navbar bg-primary text-primary-content">
            <div className="flex justify-between w-full">
              <div>
                <button className="btn btn-square btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-5 w-5 stroke-current"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>{" "}
                  </svg>
                </button>
                <button className="btn btn-ghost text-xl">Chat App</button>
              </div>
              <LoginButton />
              <LogoutButton />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export function ContactList({ onSelectRoom }: any) {
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

export function Chat({ roomId, children }: any) {
  const { roomData, messages } = useMessages(roomId);
  const currentUid = auth.currentUser?.uid;
  return (
    <section className="relative bg-slate-800 w-full p-4 pt-0 overflow-y-auto h-[calc(100vh-64px)]">
      <div className="container pb-20 space-y-4">
        {messages.map((msg) => {
          const userUid = msg.uid === currentUid ? currentUid : msg.uid;
          const dataUser = roomData?.[userUid];
          return (
            <div
              key={msg.id}
              className={`chat ${
                msg.uid === auth.currentUser?.uid ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src={dataUser?.photoURL} alt={msg.name} />
                </div>
              </div>
              <div className="chat-header">
                {dataUser?.name}
                <time className="text-xs opacity-50 ml-2">
                  {msg.createdAt?.toDate
                    ? msg.createdAt.toDate().toLocaleTimeString()
                    : ""}
                </time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Sent</div>
            </div>
          );
        })}
      </div>

      <div className="sticky flex bottom-0 left-0 right-0 w-full p-4 gap-2 justify-center items-center">
        <input
          type="text"
          placeholder="Send a Message!"
          className="input input-primary w-full"
          id="message-input"
        />
        {children}
      </div>
    </section>
  );
}

export function ChatInput({ roomId }: any) {
  const sendMessage = async () => {
    const input = document.getElementById("message-input") as HTMLInputElement;
    const text = input?.value;
    if (!text || !auth.currentUser) return;

    await addDoc(collection(db, `rooms/${roomId}/messages`), {
      text,
      uid: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    input.value = "";
  };
  return (
    <>
      <div
        onClick={sendMessage}
        className="rounded-full bg-primary w-10 h-10 flex items-center justify-center cursor-pointer"
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
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </div>
    </>
  );
}

export function LoginButton() {
  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("Login berhasil:", auth.currentUser);
      const user = auth.currentUser;
      if (!user) return;

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Login gagal:", err);
    }
  };

  return (
    <button className="btn btn-primary" onClick={login}>
      Login dengan Google
    </button>
  );
}

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logout berhasil");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <button className="btn btn-secondary" onClick={handleLogout} type="button">
      Logout
    </button>
  );
}
