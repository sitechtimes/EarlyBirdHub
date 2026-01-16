export interface DailyLink {
  id: number;
  title: string;
  old_id?: string;
  action_type: string;
  url?: string;
  img?: string;
  description?: string;
  date: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface Form {
  id?: string | null;
  title?: string;
  url?: string;
  image?: string;
  description?: string;
  date?: string;
  approved?: boolean;
}
