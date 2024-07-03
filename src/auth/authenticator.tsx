import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../db/fire";
import { getUserData } from "../db/profiles";
import { State, clearState, setState } from "./state";
import Login from "./login";
import Create from "./create";

type AuthData = {
  uid: string;
  email: string;
  displayName: string;
};

export default function Authenticator({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const proceed = (userData: State) => {
    setState(userData);
    setStep(4);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email } = user;
        setStep(1);
        getUserData(user.uid)
          .then((userData) => {
            if (userData) {
              const { id, name, data } = userData;
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
              setStep(4);
            } else {
              setAuthData({
                uid,
                email: email || "",
                displayName: displayName || "",
              });
              setStep(3);
            }
          })
          .catch(console.warn);
      } else {
        clearState();
        setStep(2);
      }
    });
    return () => unsubscribe();
  }, []);
  switch (step) {
    case 2:
      return <Login />;
    case 3:
      return <Create authData={authData!} proceed={proceed} />;
    case 4:
      return children;
    default:
      return (
        <main>
          <div className="spinner" />
        </main>
      );
  }
}
