import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function Logout() {
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
