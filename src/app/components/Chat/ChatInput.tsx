import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import InputPrimary from "../Input/InputPrimary";

export default function ChatInput({ roomId }: any) {
  const sendMessage = async (e: any) => {
    e.preventDefault();
    const input = document.getElementById("message-input") as HTMLInputElement;
    const text = input?.value;
    if (!text || !auth.currentUser) return;

    await addDoc(collection(db, `rooms/${roomId}/messages`), {
      text,
      uid: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    await setDoc(
      doc(db, "rooms", roomId),
      {
        hasMessages: true,
        lastActivity: serverTimestamp(),
      },
      { merge: true }
    );

    input.value = "";
  };
  return (
    <>
      <form onSubmit={(e) => sendMessage(e)} className="w-full flex gap-2">
        <InputPrimary
          type="text"
          placeholder="Send a Message!"
          id="message-input"
        />
        <button
          type="submit"
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
        </button>
      </form>
    </>
  );
}
