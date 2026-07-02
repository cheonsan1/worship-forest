export interface Comment {
  id: string;
  name: string;
  text: string;
  date: string;
}

export interface TreeLog {
  id: string;
  date: string;
  passage: string;
  praise: string;
  grace: string;
  prayer: string;
  likes: number;
  comments: Comment[];
}

export interface Tree {
  id: string;
  familyName: string;
  x?: number;
  z?: number;
  logs: TreeLog[];
}

export interface Flower {
  id: string;
  name: string;
  message: string;
  emoji: string;
  date: string;
  likes: number;
  comments: Comment[];
  x?: number;
  z?: number;
}

export interface Settings {
  churchName: string;
}
