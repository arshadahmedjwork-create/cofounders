export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  industry: string;
  selectedSkills: string[];
  lookingFor: string;
  idea: string;
  city: string;
  linkedin: string;
  avatarUrl?: string;
  experience?: string;
  work?: string;
  timeCommitment?: string;
  educationHistory?: EducationItem[];
  experienceHistory?: ExperienceItem[];
  userType?: string;
  companyName?: string;
  companyStage?: string;
  companyDescription?: string;
  companyLogo?: string;
  discoveryPreference?: 'candidates' | 'companies';
}

export interface EducationItem {
  school: string;
  degree: string;
  year: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  year: string;
}
