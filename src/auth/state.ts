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

interface Moment {
  id: string;
  text: string;
}

let thisMonthsMoments: Moment[] | null = null;

export const getThisMonthsMoments = () => thisMonthsMoments;

export function setThisMonthsMoments(moments: Moment[]) {
  thisMonthsMoments = moments;
}

export function addMoment(moment: Moment) {
  if (thisMonthsMoments) {
    thisMonthsMoments.push(moment);
  } else {
    thisMonthsMoments = [moment];
  }
}

export function editMoment(id: string, text: string) {
  if (thisMonthsMoments) {
    const i = thisMonthsMoments.findIndex((m) => m.id === id);
    if (i >= 0) {
      thisMonthsMoments[i].text = text;
    }
  }
}

export function removeMoment(id: string) {
  if (thisMonthsMoments) {
    const i = thisMonthsMoments.findIndex((m) => m.id === id);
    if (i >= 0) {
      thisMonthsMoments.splice(i, 1);
    }
  }
}

export function setFriends(list: Friend[]) {
  friends = list;
}

export function addFriend(newFriend: Friend) {
  if (friends) {
    friends.push(newFriend);
  } else {
    friends = [newFriend];
  }
}

export const getFriends = () => friends;

export const getState = () => state;

export function setState(newState: State) {
  state = newState;
}

export function changeName(name: string) {
  if (state) {
    state.name = name;
  }
}

export function clearState() {
  state = null;
  friends = null;
}
