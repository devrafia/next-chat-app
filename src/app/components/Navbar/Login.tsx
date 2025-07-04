import { auth, db, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
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
