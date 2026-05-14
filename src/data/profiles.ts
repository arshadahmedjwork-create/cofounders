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
  hasTakenSynapse?: boolean;
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
