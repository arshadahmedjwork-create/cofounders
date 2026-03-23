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

export const DEMO_PROFILES: Profile[] = [
  { id: "1", name: "Arjun Mehta", role: "Founder & CTO", location: "Bangalore", domain: "FinTech", tags: ["React", "Node.js", "AI/ML"], stage: "Seed", matchPercent: 94, avatarColor: "hsl(262, 75%, 50%)", bio: "Ex-Google engineer building the future of payments infrastructure for India.", lookingFor: "Business Co-Founder" },
  { id: "2", name: "Priya Sundaram", role: "Founder & CEO", location: "Mumbai", domain: "CleanTech", tags: ["GTM", "Strategy", "Fundraising"], stage: "Pre-Seed", matchPercent: 89, avatarColor: "hsl(174, 52%, 42%)", bio: "McKinsey alum passionate about sustainable supply chains and green logistics.", lookingFor: "Technical Co-Founder" },
  { id: "3", name: "Karan Bhatia", role: "Freelance Full-Stack", location: "Delhi", domain: "EdTech", tags: ["Vue.js", "Python", "MongoDB"], stage: "Idea", matchPercent: 82, avatarColor: "hsl(42, 85%, 50%)", bio: "10+ years crafting scalable web products. Looking for a mission-driven startup to join.", lookingFor: "Co-Founder" },
  { id: "4", name: "Sneha Joshi", role: "Founder Operator", location: "Pune", domain: "HealthTech", tags: ["Operations", "Partnerships", "Growth"], stage: "Series A", matchPercent: 91, avatarColor: "hsl(330, 70%, 55%)", bio: "Built ops for 2 successful startups. Expert at 0→1 scaling and building cross-functional teams.", lookingFor: "Technical Co-Founder" },
  { id: "5", name: "Rahul Verma", role: "Freelance Data Scientist", location: "Hyderabad", domain: "AI/ML", tags: ["Python", "TensorFlow", "NLP"], stage: "Idea", matchPercent: 86, avatarColor: "hsl(200, 70%, 45%)", bio: "IIT Madras grad specializing in generative AI. Seeking meaningful problem to solve with the right team.", lookingFor: "Co-Founder" },
  { id: "6", name: "Divya Nair", role: "Founder & CPO", location: "Chennai", domain: "B2B SaaS", tags: ["Product", "UX", "Enterprise"], stage: "Seed", matchPercent: 88, avatarColor: "hsl(290, 60%, 55%)", bio: "Built 3 products from 0 to $1M ARR. Expert at product-led growth and B2B enterprise sales.", lookingFor: "Technical Co-Founder" },
];
