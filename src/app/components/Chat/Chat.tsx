import { auth, db } from "@/lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

function useMessages(roomId: any) {
  const [roomData, setRoomData] = useState(null);
  const [messages, setMessages] = useState<any[]>([]);

  const fetchRoomData = async () => {
    const docs = await getDoc(doc(db, "rooms", roomId));
    if (docs.exists()) {
      setRoomData(docs.data().userInfo);
    }
  };

  useEffect(() => {
    fetchRoomData();

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

      const currentUid = auth.currentUser?.uid;
      if (currentUid) {
        docs.forEach((msg: any) => {
          if (!msg.readBy?.includes(currentUid)) {
            const msgRef = doc(db, `rooms/${roomId}/messages/${msg.id}`);
            updateDoc(msgRef, {
              readBy: arrayUnion(currentUid),
            });
          }
        });
      }
    });
    return () => unsubscribe();
  }, [roomId]);

  return { roomData, messages };
}

export default function Chat({ roomId, children }: any) {
  const { roomData, messages } = useMessages(roomId);
  const currentUid = auth.currentUser?.uid;
  const bottomRef = useRef<HTMLDivElement>(null);

  const targetUserUid = Object.keys(roomData || {}).find(
    (uid) => uid !== currentUid
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="relative flex flex-col bg-slate-800 w-full py-4 pb-0 pt-0 h-[calc(100vh-64px)]">
      <div className="container h-full p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isOwnMessage = msg.uid === currentUid;
            const userUid = msg.uid === currentUid ? currentUid : msg.uid;
            const dataUser = roomData?.[userUid];

            const status =
              isOwnMessage && targetUserUid
                ? msg.readBy?.includes(targetUserUid)
                  ? "Seen"
                  : "Sent"
                : "";
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
                <div
                  className={`chat-bubble ${
                    msg.uid === auth.currentUser?.uid ? "bg-primary" : ""
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {msg.text}
                    {msg.uid == auth.currentUser.uid ? (
                      <div className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 30 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-white inline"
                        >
                          {status == "Seen" ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          ) : (
                            ""
                          )}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 13l4 4L24 7"
                          />
                        </svg>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={bottomRef}></div>
      </div>

      <div className="sticky flex bottom-0 left-0 bg-slate-900 right-0 w-full p-4 rounded-t-sm gap-2 justify-center items-center">
        {children}
      </div>
    </section>
  );
}
