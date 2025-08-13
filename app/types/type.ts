export interface Form {
  id: number | null;
  title: string;
  url?: string;
  image?: string;
  description?: string;
  date: string;
  approved: boolean;
}
