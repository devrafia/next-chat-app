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
  where,
} from "firebase/firestore";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Navbar/Login";
import { Logout } from "./components/Navbar/Logout";
import { Contact } from "./components/Contact/Contact";
import Chat from "./components/Chat/Chat";
import ChatInput from "./components/Chat/ChatInput";
import AddForm from "./components/Contact/AddForm";

export default function App() {
  const [roomId, setRoomId] = useState("s");
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setContacts([]);
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
      <Navbar>{auth.currentUser ? <Logout /> : <Login />}</Navbar>
      <main>
        <div className="bg-slate-400 h-[calc(100vh-64px)]">
          <div className="flex flex-1">
            <Contact onSelectRoom={setRoomId} contacts={contacts}>
              {(inputRef: any) => (
                <AddForm inputRef={inputRef} setRoomId={setRoomId} />
              )}
            </Contact>
            <Chat roomId={roomId}>
              <ChatInput roomId={roomId} />
            </Chat>
          </div>
        </div>
      </main>
    </>
  );
}
