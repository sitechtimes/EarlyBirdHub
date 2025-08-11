export interface DailyLink {
  id: number;
  title: string;
  url?: string;
  image?: string;
  description?: string;
  date: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
}
