import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBv_wdtmlXnxfylui92JEodN-twfpUpOvI",
  authDomain: "monthly-moments.firebaseapp.com",
  databaseURL: "https://monthly-moments.firebaseio.com",
  projectId: "monthly-moments",
  storageBucket: "monthly-moments.appspot.com",
  messagingSenderId: "576961635182",
  appId: "1:576961635182:web:4151262d5812a2e20d177f",
  measurementId: "G-XV0BVV519F",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
