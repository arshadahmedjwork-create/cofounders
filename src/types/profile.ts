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
  fullBio?: string;
  companyName?: string;
  companyStage?: string;
  companyDescription?: string;
  companyLogo?: string;
  discoveryPreference?: 'candidates' | 'companies';
  
  // Structured Matching Fields
  intent?: 'building' | 'joining';
  startupGoal?: string;
  startupStage?: string;
  whatYouCover?: string[];
  whatYouNeed?: string[];
  cofounderType?: string;
  compensation?: string;
  nonNegotiables?: string[];
  
  aspirantGoal?: string;
  preferredStage?: string;
  workStyle?: string[];
  survivalTime?: string;
  equityExpectation?: string;
  domainTags?: string[];
  profileBackground?: string;
  
  // Founder DNA (0-100)
  dnaRisk?: number;
  dnaSpeed?: number;
  dnaLeadership?: number;
  dnaCommunication?: number;
  
  // Compatibility Breakdown (0-100)
  compSkill?: number;
  compVision?: number;
  compWorkStyle?: number;
  compAmbition?: number;
  
  // Startup Journey
  journeyStage?: 'Idea' | 'MVP' | 'Traction' | 'Scale';
  tractionDetails?: string[];
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
