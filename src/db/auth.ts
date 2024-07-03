import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./fire";

const provider = new GoogleAuthProvider();

export const logout = () => signOut(auth);

export const signInWithGoogle = () => signInWithPopup(auth, provider);

export const getCurrentUser = () => auth.currentUser;
