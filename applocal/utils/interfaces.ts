export interface DailyLink {
  id: number;
  title: string;
  url?: string;
  image?: string;
  description?: string;
  date_end: string;
  date_uploaded: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
}
