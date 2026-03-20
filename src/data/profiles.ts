export interface Profile {
  id: string;
  name: string;
  role: string;
  location: string;
  domain: string;
  tags: string[];
  stage: string;
  matchPercent: number;
  avatarColor: string;
  bio: string;
  lookingFor: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  quote: string;
  raised?: string;
  rating: number;
  avatarColor: string;
}
