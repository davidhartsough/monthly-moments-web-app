// TODO: put 'em all here?

export interface Profile {
  uid: string;
  username: string;
  name: string;
  connections: string[];
  searchTerms: string[];
  ignored: string[];
  requested: string[];
  requests: string[];
}

export interface Moment {
  uid: string;
  username: string;
  month: string;
  text: string;
  timestamp: number;
}
