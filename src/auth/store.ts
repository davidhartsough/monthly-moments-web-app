/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { isValidStr } from "../utils";

const storage = window.sessionStorage;

interface AuthData {
  uid: string;
  email: string;
  displayName: string;
}

interface UserData {
  uid: string;
  id: string;
  name: string;
}

const authDataKey = "aud";
const userDataKey = "ud";

export function storeAuthData(uid: string, email: string, displayName: string) {
  storage.setItem(
    authDataKey,
    JSON.stringify({
      uid,
      email,
      displayName,
    })
  );
}

export function storeUserData(uid: string, username: string, name: string) {
  storage.setItem(
    userDataKey,
    JSON.stringify({
      uid,
      id: username,
      name,
    })
  );
}

const clearStoredAuth = () => storage.removeItem(authDataKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAuthData(o: any): o is AuthData {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    o &&
    typeof o === "object" &&
    "uid" in o &&
    "email" in o &&
    "displayName" in o &&
    isValidStr(o.uid) &&
    typeof o.email === "string" &&
    typeof o.displayName === "string"
  );
}

export function getStoredAuthData(): AuthData | null {
  const authDataStr = storage.getItem(authDataKey);
  if (authDataStr && authDataStr.length > 1) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const authData = JSON.parse(authDataStr);
      if (isAuthData(authData)) {
        return authData;
      } else {
        clearStoredAuth();
        return null;
      }
    } catch {
      clearStoredAuth();
      return null;
    }
  }
  clearStoredAuth();
  return null;
}

const clearStoredUser = () => storage.removeItem(userDataKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isUserData(o: any): o is UserData {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    o &&
    typeof o === "object" &&
    "uid" in o &&
    "id" in o &&
    "name" in o &&
    isValidStr(o.uid) &&
    isValidStr(o.id) &&
    isValidStr(o.name)
  );
}

export function getStoredUserData(): UserData | null {
  const storedDataStr = storage.getItem(userDataKey);
  if (storedDataStr && storedDataStr.length > 1) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const userData = JSON.parse(storedDataStr);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (isUserData(userData)) {
        return userData;
      } else {
        clearStoredUser();
        return null;
      }
    } catch {
      clearStoredUser();
      return null;
    }
  }
  clearStoredUser();
  return null;
}

export function clearStore() {
  clearStoredAuth();
  clearStoredUser();
}
