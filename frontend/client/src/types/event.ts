export interface Event {
  id: number;
  name: string;
  slug: string;
  description: string;
  date: string;
  endDate: string;
  location:string;
  fee: number;
  maxParticipants?: number;
  imageUrl: string;
  featured: boolean;
  category: string;
  tags?: string[];
  active: boolean;
}