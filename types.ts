
export enum Book {
  JaneEyre = "Jane Eyre",
  MonteCristo = "The Count of Monte Cristo",
}

export enum Level {
  Beginner = "Beginner (CET-4)",
  Intermediate = "Intermediate (CET-6)",
  Advanced = "Advanced (GRE)",
}

export type WordCount = 10 | 20 | 30;

export interface Word {
  id: string;
  word: string;
  pronunciation: string;
  translation: string;
}
