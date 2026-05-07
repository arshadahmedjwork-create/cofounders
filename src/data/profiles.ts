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

export const DEMO_PROFILES: Profile[] = [
  {
    id: "demo-1",
    name: "Sarah Chen",
    role: "Technical Founder",
    domain: "AI & Robotics",
    location: "Singapore",
    bio: "Ex-Google DeepMind engineer building the next generation of autonomous delivery systems. I specialize in computer vision and pathfinding algorithms.",
    tags: ["Python", "TensorFlow", "Robotics", "Cloud Arch"],
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    matchPercent: 98,
    lookingFor: "Business-savvy co-founder with experience in logistics or supply chain management.",
    hasTakenSynapse: true,
    profileBackground: "sunset",
    dnaRisk: 88,
    dnaSpeed: 95,
    dnaLeadership: 72,
    dnaCommunication: 80,
    compSkill: 98,
    compVision: 94,
    compWorkStyle: 88,
    compAmbition: 96,
    journeyStage: 'MVP',
    tractionDetails: ["Proprietary SLAM algorithm patent", "Pre-seed: $250K committed", "5 Pilot partners in SEA"]
  },
  {
    id: "demo-2",
    name: "Marcus Rodriguez",
    role: "Product Visionary",
    domain: "FinTech / Web3",
    location: "Miami, FL",
    bio: "Serial entrepreneur with 2 exits. Currently disrupting the cross-border remittance space using L2 scaling solutions. I focus on UX and growth.",
    tags: ["Product Strategy", "Growth", "Solidity", "UX/UI"],
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    matchPercent: 94,
    lookingFor: "Full-stack engineer (React/Node) with a passion for decentralization and high-throughput systems.",
    hasTakenSynapse: true,
    profileBackground: "midnight",
    dnaRisk: 92,
    dnaSpeed: 88,
    dnaLeadership: 90,
    dnaCommunication: 94,
    compSkill: 85,
    compVision: 98,
    compWorkStyle: 92,
    compAmbition: 95,
    journeyStage: 'Idea',
    tractionDetails: ["Waitlist: 5K+ qualified leads", "Advisors from Stripe & Coinbase", "Design prototype completed"]
  },
  {
    id: "demo-3",
    name: "Elena Petrova",
    role: "Growth Marketer",
    domain: "SaaS / B2B",
    location: "London, UK",
    bio: "Scaled a SaaS from 0 to 1M ARR in 14 months. Master of content loops and community-led growth. Now building a platform for remote creator teams.",
    tags: ["GTM Strategy", "Community", "Paid Acquisition", "SEO"],
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    matchPercent: 91,
    lookingFor: "Technical lead who can build fast and iterate even faster. Experience in real-time collab tools is a plus.",
    hasTakenSynapse: true,
    profileBackground: "emerald",
    dnaRisk: 75,
    dnaSpeed: 92,
    dnaLeadership: 85,
    dnaCommunication: 98,
    compSkill: 92,
    compVision: 90,
    compWorkStyle: 85,
    compAmbition: 88,
    journeyStage: 'Traction',
    tractionDetails: ["$20K MRR in 3 months", "Featured in TechCrunch", "Global team of 8"]
  }
];
