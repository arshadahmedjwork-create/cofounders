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
  avatarUrl?: string;
  work?: string;
  timeCommitment?: string;
  educationHistory?: import("@/types/profile").EducationItem[];
  experienceHistory?: import("@/types/profile").ExperienceItem[];
  userType?: string;
  companyName?: string;
  companyStage?: string;
  companyDescription?: string;
  companyLogo?: string;
  discoveryPreference?: 'candidates' | 'companies';
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

export const DEMO_PROFILES: Profile[] = [];
