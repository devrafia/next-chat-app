import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

function useMessages(roomId: any) {
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

export default function Chat({ roomId, children }: any) {
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
        {children}
      </div>
    </section>
  );
}
