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
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Navbar/Login";
import { Logout } from "./components/Navbar/Logout";
import { Contact } from "./components/Contact/Contact";
import Chat from "./components/Chat/Chat";
import ChatInput from "./components/Chat/ChatInput";
import AddForm from "./components/Contact/AddForm";

export default function App() {
  const [roomId, setRoomId] = useState("s");
  return (
    <>
      <Navbar>
        <Login />
        <Logout />
      </Navbar>
      <main>
        <div className="flex flex-1 h-[calc(100vh-64px)]">
          <Contact onSelectRoom={setRoomId}>
            {(inputRef: any) => (
              <AddForm inputRef={inputRef} setRoomId={setRoomId} />
            )}
          </Contact>
          <Chat roomId={roomId}>
            <ChatInput roomId={roomId} />
          </Chat>
        </div>
      </main>
    </>
  );
}
