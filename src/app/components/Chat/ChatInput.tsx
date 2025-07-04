import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function ChatInput({ roomId }: any) {
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
      <input
        type="text"
        placeholder="Send a Message!"
        className="input input-primary w-full"
        id="message-input"
      />
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
