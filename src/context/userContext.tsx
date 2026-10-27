import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import axios from "axios";
import type { User } from "../models/user";
import { useDispatch } from "react-redux";
import { loginCart, logoutCart } from "../models/cartSlice";


interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);


export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // בעליית האפליקציה - טעינת המשתמש מהשרת לפי ה-token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios.get("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  // כל פעם שהמשתמש מתחלף - טעינת העגלה שלו, ובהתנתקות ריקון העגלה מהמסך
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(user ? loginCart(String(user.id)) : logoutCart());
  }, [user?.id]);

  const isAdmin = user?.role === "admin";

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser חייב להיות בתוך UserProvider");
  return ctx;
}
