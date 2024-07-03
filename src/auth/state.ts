interface UserDataDoc {
  searchTerms: string[];
  connections: string[];
  ignored: string[];
  requested: string[];
  requests: string[];
}

export interface State {
  uid: string;
  username: string;
  name: string;
  data: UserDataDoc;
}

let state: State | null = null;

interface Friend {
  id: string;
  name: string;
}

let friends: Friend[] | null = null;

export function setFriends(list: Friend[]) {
  friends = list;
}

export const getFriends = () => friends;

export const getState = () => state;

export function setState(newState: State) {
  state = newState;
}

export function clearState() {
  state = null;
  friends = null;
}
