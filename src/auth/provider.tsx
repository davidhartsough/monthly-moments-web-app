import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../db/fire";
import { getUserData } from "../db/profiles";
import { AuthContext, UserData } from "./context";
import { clearStore, storeAuthData, storeUserData } from "./store";
import { clearState, setState } from "./state";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email } = user;
        storeAuthData(uid, email || "", displayName || "");
        getUserData(user.uid)
          .then((userData) => {
            if (userData) {
              const { id, name, data } = userData;
              storeUserData(uid, id, name);
              setUser({
                uid,
                id,
                name,
                displayName,
                email,
                data,
              });
              setState({
                uid,
                username: id,
                name,
                data: {
                  connections: data.connections,
                  searchTerms: data.searchTerms,
                  ignored: data.ignored,
                  requested: data.requested,
                  requests: data.requests,
                },
              });
            } else {
              setUser({
                id: null,
                name: null,
                uid,
                displayName,
                email,
                data: null,
              });
            }
            setLoading(false);
          })
          .catch(console.warn);
      } else {
        setUser(null);
        clearStore();
        clearState();
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
