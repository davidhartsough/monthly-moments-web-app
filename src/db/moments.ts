import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./fire";
import { getState } from "../auth/state";

const momentsCollection = collection(db, "moments");

export async function createMoment(month: string, text: string) {
  const { uid, username } = getState()!;
  const { id } = await addDoc(momentsCollection, {
    uid,
    username,
    month,
    text,
    timestamp: serverTimestamp(),
  });
  return id;
}

export async function updateMoment(id: string, text: string) {
  await updateDoc(doc(db, "moments", id), { text });
}

export async function deleteMoment(id: string) {
  await deleteDoc(doc(db, "moments", id));
}

type BasicMoment = {
  id: string;
  text: string;
};

export async function getMyMomentsThisMonth(): Promise<BasicMoment[]> {
  const { uid, username } = getState()!;
  const month = "2024-05";
  const q = query(
    momentsCollection,
    where("uid", "==", uid),
    where("username", "==", username),
    where("month", "==", month),
    orderBy("timestamp")
  );
  const res = await getDocs(q);
  if (res.empty) return [];
  const moments = res.docs
    .map((d) =>
      d.exists()
        ? {
            id: d.id,
            text: d.get("text") as string,
          }
        : null
    )
    .filter((d): d is BasicMoment => !!d);
  return moments;
}

export async function getMomentsForMonth(id: string, month: string) {
  const q = query(
    momentsCollection,
    where("username", "==", id),
    where("month", "==", month),
    orderBy("timestamp")
  );
  const res = await getDocs(q);
  if (res.empty) return [];
  const moments = res.docs
    .map((d) =>
      d.exists()
        ? {
            id: d.id,
            text: d.get("text") as string,
          }
        : null
    )
    .filter((d): d is BasicMoment => !!d);
  return moments;
}
