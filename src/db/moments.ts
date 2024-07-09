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
import {
  addMoment,
  editMoment,
  getState,
  getThisMonthsMoments,
  removeMoment,
  setThisMonthsMoments,
} from "../auth/state";
import { thisMonth } from "../date-utils";
import { getStoredMoments, storeMoments } from "./store";

const momentsCollection = collection(db, "moments");

export async function createMoment(text: string) {
  const { uid, username } = getState()!;
  const { id } = await addDoc(momentsCollection, {
    uid,
    username,
    month: thisMonth,
    text,
    timestamp: serverTimestamp(),
  });
  addMoment({ id, text });
  return id;
}

export async function updateMoment(id: string, text: string) {
  await updateDoc(doc(db, "moments", id), { text });
  editMoment(id, text);
}

export async function deleteMoment(id: string) {
  await deleteDoc(doc(db, "moments", id));
  removeMoment(id);
}

type BasicMoment = {
  id: string;
  text: string;
};

export async function getMyMomentsThisMonth(): Promise<BasicMoment[]> {
  const myMoments = getThisMonthsMoments();
  if (myMoments) return myMoments;
  const { uid, username } = getState()!;
  const month = thisMonth;
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
  setThisMonthsMoments(moments);
  return moments;
}

export async function getMomentsForMonth(id: string, month: string) {
  const backup = getStoredMoments(id, month);
  if (backup) return backup;
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
  storeMoments(id, month, moments);
  return moments;
}
