import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// ✅ สร้าง Context
const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);        // ข้อมูลจาก Firebase Auth
  const [userData, setUserData] = useState(null); // ข้อมูลจาก Firestore
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ ฟังการเปลี่ยนแปลง Auth
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, userData, setUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ custom hook ใช้ง่าย ๆ
export function useUser() {
  return useContext(UserContext);
}
