import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  limit,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { db } from "./fire";
import { changeName, getFriends, getState, setFriends } from "../auth/state";
import { thisMonth } from "../date-utils";

const profilesCollection = collection(db, "profiles");

interface BasicProfile {
  id: string;
  name: string;
}

type UserProfile = {
  uid: string;
  username: string;
  name: string;
  connections: string[];
  searchTerms: string[];
  ignored: string[];
  requested: string[];
  requests: string[];
};

async function fetchUserDoc(uid: string) {
  const q = query(profilesCollection, where("uid", "==", uid));
  const results = await getDocs(q);
  if (results.empty) return null;
  const doc = results.docs[0];
  const data = doc.data() as UserProfile;
  const name = data.name;
  const { id } = doc;
  return { id, uid, name, data };
}

export async function getUserData(uid: string) {
  const userDoc = await fetchUserDoc(uid);
  if (userDoc) return userDoc;
  return null;
}

export async function getMyFriends(): Promise<BasicProfile[]> {
  const ogFriends = getFriends();
  if (ogFriends) return ogFriends;
  const { data } = getState()!;
  const promises = data.connections.map((id) =>
    getDoc(doc(db, "profiles", id))
  );
  const docs = await Promise.all(promises);
  const friends = docs
    .map((doc) =>
      doc.exists()
        ? {
            id: doc.id,
            name: doc.get("name") as string,
          }
        : null
    )
    .filter((d): d is BasicProfile => !!d);
  setFriends(friends);
  return friends;
}

export async function getProfile(id: string) {
  const state = getState();
  if (state && state.username === id) {
    return { id, name: state.name };
  }
  const friends: BasicProfile[] | null = getFriends();
  if (friends) {
    const friend = friends.find((f) => f.id === id);
    if (friend) return friend;
  }
  const res = await getDoc(doc(db, "profiles", id));
  if (!res.exists()) return null;
  const name = res.get("name") as string;
  return { id, name };
}

type Status = "open" | "connected" | "sent-req" | "have-req";

export interface Peep extends BasicProfile {
  status: Status;
}

function getStatus(
  id: string,
  {
    connections,
    requested,
    requests,
  }: {
    connections: string[];
    requested: string[];
    requests: string[];
  }
): Status {
  if (connections.includes(id)) return "connected";
  if (requested.includes(id)) return "sent-req";
  if (requests.includes(id)) return "have-req";
  return "open";
}

export async function getPeople(search: string): Promise<Peep[]> {
  const q = query(
    profilesCollection,
    where("searchTerms", "array-contains", search.toUpperCase()),
    limit(50)
  );
  const res = await getDocs(q);
  if (res.empty) return [];
  const { username, data } = getState()!;
  const { ignored } = data;
  const peeps = res.docs
    .map((doc) =>
      doc.exists()
        ? {
            id: doc.id,
            name: doc.get("name") as string,
          }
        : null
    )
    .filter(
      (d): d is BasicProfile =>
        !!d && d.id !== username && !ignored.includes(d.id)
    );
  return peeps.map(({ id, name }) => ({
    id,
    name,
    status: getStatus(id, data),
  }));
}

export async function getFriendRequests() {
  const { data } = getState()!;
  const promises = data.requests.map((id) => getDoc(doc(db, "profiles", id)));
  const docs = await Promise.all(promises);
  const friendRequests = docs
    .map((doc) =>
      doc.exists()
        ? {
            id: doc.id,
            name: doc.get("name") as string,
          }
        : null
    )
    .filter((d): d is BasicProfile => !!d);
  return friendRequests;
}

export async function sendFriendRequest(id: string) {
  const { username } = getState()!;
  const promises = [
    updateDoc(doc(db, "profiles", username), {
      requested: arrayUnion(id),
    }),
    updateDoc(doc(db, "profiles", id), {
      requests: arrayUnion(username),
    }),
  ];
  await Promise.all(promises);
}

export async function acceptFriendRequest(id: string) {
  const { username } = getState()!;
  const promises = [
    updateDoc(doc(db, "profiles", username), {
      connections: arrayUnion(id),
      requests: arrayRemove(id),
    }),
    updateDoc(doc(db, "profiles", id), {
      connections: arrayUnion(username),
      requested: arrayRemove(username),
    }),
  ];
  await Promise.all(promises);
}

export async function ignoreFriendRequest(id: string) {
  const { username } = getState()!;
  await updateDoc(doc(db, "profiles", username), {
    ignored: arrayUnion(id),
    requests: arrayRemove(id),
  });
}

export async function isUsernameTaken(username: string) {
  const userDoc = await getDoc(doc(db, "profiles", username));
  return userDoc.exists();
}

export interface Profile {
  uid: string;
  username: string;
  name: string;
  searchTerms: string[];
  connections: string[];
  ignored: string[];
  requested: string[];
  requests: string[];
}

export async function createNewProfile(p: Profile) {
  await setDoc(doc(db, "profiles", p.username), {
    ...p,
    firstMonth: thisMonth,
  });
}

export async function updateName(name: string) {
  const { username } = getState()!;
  await updateDoc(doc(db, "profiles", username), { name });
  changeName(name);
}
