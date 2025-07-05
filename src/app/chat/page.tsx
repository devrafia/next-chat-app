"use client";
import { auth, db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Navbar from "../components/Navbar/Navbar";
import Login from "../components/Navbar/Login";
import { Logout } from "../components/Navbar/Logout";
import { Contact } from "../components/Contact/Contact";
import Chat from "../components/Chat/Chat";
import ChatInput from "../components/Chat/ChatInput";
import AddForm from "../components/Contact/AddForm";

export default function App() {
  const [roomId, setRoomId] = useState(null);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setContacts([]);
        setRoomId(null);
        return;
      }

      const q = query(
        collection(db, "rooms"),
        where("participants", "array-contains", user.uid),
        where("hasMessages", "==", true),
        orderBy("lastActivity", "desc")
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

        setContacts(
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
  return (
    <>
      <Navbar>
        {auth.currentUser ? (
          <>
            <img
              src={auth.currentUser.photoURL}
              className="rounded-full w-10 h-10"
              alt=""
            />
            <Logout />
          </>
        ) : (
          <Login />
        )}
      </Navbar>
      <main>
        <div className="bg-slate-400 h-[calc(100vh-64px)]">
          <div className="flex flex-1 h-full">
            <Contact onSelectRoom={setRoomId} contacts={contacts}>
              {(inputRef: any) => (
                <AddForm inputRef={inputRef} setRoomId={setRoomId} />
              )}
            </Contact>
            {roomId ? (
              <Chat roomId={roomId}>
                <ChatInput roomId={roomId} />
              </Chat>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-slate-900 w-full text-center p-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-24 h-24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>

                <h1 className="text-white text-lg sm:text-xl md:text-2xl font-semibold max-w-md">
                  Please select a contact or create a new one to start chatting.
                </h1>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
