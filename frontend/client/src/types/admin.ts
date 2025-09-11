export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  featured: boolean;
  endDate?: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  fee: number;
  maxParticipants?: number;
  registrations?: number;
  active: boolean;
  imageUrl: string;
  slug: string;
  featured: boolean;
  category?: string;
  tags?: string[];
  contactEmail?: string;
  contactPhone?: string;
  registrationUrl?: string;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'volunteer' | 'donor';
  fullName: string;
  createdAt: string;
  lastLogin?: string;
  active: boolean;
}

export interface Volunteer {
  id: number;
  userId: number;
  skills: string[];
  availability: string[];
  interests: string[];
  bio: string;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
  completedHours: number;
}

export interface Donation {
  id: number;
  amount: number;
  userId?: number;
  causeId?: number;
  transactionId: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: string;
  anonymous: boolean;
  message?: string;
}
