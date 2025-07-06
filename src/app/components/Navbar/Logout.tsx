import { auth, database } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { ref, set } from "firebase/database";

export function Logout() {
  const handleLogout = async () => {
    try {
      const uid = auth.currentUser.uid;
      await signOut(auth);
      const userStatusDatabaseRef = ref(database, "status/" + uid);

      set(userStatusDatabaseRef, {
        state: "offline",
        last_changed: Date.now(),
      });
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
