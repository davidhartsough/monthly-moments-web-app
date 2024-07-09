/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const storage = window.localStorage;

type Moment = {
  id: string;
  text: string;
};

function isValidStr(str: unknown): str is string {
  return !!str && typeof str === "string" && str.length > 1;
}

const separator = "__";
const getKey = (id: string, month: string) => `${id}${separator}${month}`;

export function storeMoments(
  username: string,
  month: string,
  moments: Moment[]
) {
  storage.setItem(getKey(username, month), JSON.stringify(moments));
}

export function clearStorage() {
  storage.clear();
}

export function checkStorage() {
  if (storage.length > 30) {
    clearStorage();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isMoment(o: any): o is Moment {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    o &&
    typeof o === "object" &&
    "id" in o &&
    "text" in o &&
    isValidStr(o.id) &&
    isValidStr(o.text)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isMomentsData(arr: any): arr is Moment[] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return arr && Array.isArray(arr) && arr.length > 0 && arr.every(isMoment);
}

export function getStoredMoments(
  username: string,
  month: string
): Moment[] | null {
  const key = getKey(username, month);
  const momentsDataStr = storage.getItem(key);
  if (momentsDataStr) {
    if (momentsDataStr.length > 2) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const momentsData = JSON.parse(momentsDataStr);
        if (isMomentsData(momentsData)) {
          return momentsData;
        } else {
          storage.removeItem(key);
          return null;
        }
      } catch {
        storage.removeItem(key);
        return null;
      }
    } else {
      storage.removeItem(key);
    }
  }
  return null;
}
