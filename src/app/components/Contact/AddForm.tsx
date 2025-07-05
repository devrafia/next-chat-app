import { useEffect, useRef } from "react";
import InputPrimary from "../Input/InputPrimary";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AddForm({ inputRef, setRoomId }: any) {
  async function handleSubmit(e: any) {
    e.preventDefault();

    const input = document.getElementById("add-form-input") as HTMLInputElement;
    const emailInput = input?.value?.trim().toLowerCase();
    if (!emailInput || !auth.currentUser)
      return alert("Email harus diisi dan kamu harus login");

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", emailInput));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("User dengan email tersebut tidak ditemukan");
      return;
    }

    const targetUser = querySnapshot.docs[0];

    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not logged in");

    const uidA = currentUser.uid;
    const uidB = targetUser.id;

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
            name: targetUser.data().name,
            photoURL: targetUser.data().photoURL,
            email: targetUser.data().email,
          },
        },
        hasMessages: false,
      },
      { merge: true }
    );
    setRoomId(roomId);

    input.value = "";
    alert("Kontak berhasil ditambahkan");
  }
  return (
    <>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Contact</h3>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <p className="py-4">Email</p>
            <InputPrimary
              ref={inputRef}
              type="text"
              placeholder="Email"
              id="add-form-input"
            />
            <button className="btn btn-primary w-max mt-4 ml-auto">Add</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="bg-transparent">close</button>
        </form>
      </dialog>
    </>
  );
}
