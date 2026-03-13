export interface Profile {
  id: number;
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

export const profiles: Profile[] = [
  {
    id: 1,
    name: "Ananya Krishnan",
    role: "Startup Founder",
    location: "Bangalore, KA",
    domain: "AI / ML",
    tags: ["Product", "Vision", "Fundraising"],
    stage: "Pre-seed",
    matchPercent: 94,
    avatarColor: "#C62828",
    bio: "Ex-Google PM with 7 years building consumer products. Have ₹30L in angel commitments. Looking for a strong ML engineer to co-build an AI-native hiring platform.",
    lookingFor: "Technical co-founder (CTO profile)",
  },
  {
    id: 2,
    name: "Vikram Shetty",
    role: "Freelance Engineer",
    location: "Remote / Mumbai",
    domain: "FinTech",
    tags: ["Engineering", "Backend", "APIs"],
    stage: "Idea",
    matchPercent: 91,
    avatarColor: "#2E7D32",
    bio: "Full-stack engineer with 9 years, built core infra at two unicorns. Ready to go full-time on something meaningful. Strong in payments and compliance APIs.",
    lookingFor: "Business / GTM co-founder",
  },
  {
    id: 3,
    name: "Deepa Nair",
    role: "Serial Entrepreneur",
    location: "Chennai, TN",
    domain: "HealthTech",
    tags: ["Sales", "GTM", "Ops"],
    stage: "Seed",
    matchPercent: 88,
    avatarColor: "#F57F17",
    bio: "2x founder. First startup acquired in 2022. Building in digital health now. Looking for a product-first co-founder who understands B2B2C models.",
    lookingFor: "Technical / Product co-founder",
  },
  {
    id: 4,
    name: "Karthik Rajan",
    role: "Corporate Operator",
    location: "Hyderabad, TS",
    domain: "SaaS / B2B",
    tags: ["Finance", "Ops", "Strategy"],
    stage: "Pre-idea",
    matchPercent: 85,
    avatarColor: "#4527A0",
    bio: "VP Strategy at a $400M SaaS company. MBA from IIM-B. Ready to take the leap. Have strong enterprise network in the manufacturing sector.",
    lookingFor: "Founding engineer or CTO",
  },
  {
    id: 5,
    name: "Meera Pillai",
    role: "Freelance Designer",
    location: "Kochi, KL",
    domain: "D2C / Consumer",
    tags: ["Design", "Brand", "UX"],
    stage: "Idea",
    matchPercent: 82,
    avatarColor: "#00838F",
    bio: "Award-winning product designer. Worked with 30+ startups. Want to stop consulting and co-own a consumer brand. Bring design-led thinking and a loyal user community.",
    lookingFor: "Technical + Business co-founder",
  },
  {
    id: 6,
    name: "Suresh Babu",
    role: "Startup Founder",
    location: "Pune, MH",
    domain: "Climate Tech",
    tags: ["Hardware", "Ops", "R&D"],
    stage: "Pre-seed",
    matchPercent: 79,
    avatarColor: "#558B2F",
    bio: "PhD in environmental engineering from IIT-M. Built a working EV charging prototype. Need a business-savvy co-founder to commercialize the technology.",
    lookingFor: "Business / Sales co-founder",
  },
];

export const testimonials = [
  {
    name: "Priya & Arjun",
    company: "NexaPay",
    quote: "We met through CoFounder Matrimony and raised ₹4.5Cr within 6 months. The PsycheMap assessment predicted our complementary working styles perfectly.",
    raised: "₹4.5Cr Seed Round",
    rating: 5,
    avatarColor: "#C62828",
  },
  {
    name: "Rohit & Sneha",
    company: "GreenGrid",
    quote: "The 7-Day Sprint convinced us we could work together. A year later, we have 50K users and a growing team.",
    raised: "₹2Cr Pre-Seed",
    rating: 5,
    avatarColor: "#2E7D32",
  },
  {
    name: "Aisha & Kartik",
    company: "MedBridge AI",
    quote: "Finding a co-founder who matches your energy AND ethics is rare. This platform made it possible.",
    raised: "₹8Cr Series A",
    rating: 5,
    avatarColor: "#F57F17",
  },
  {
    name: "Dev & Lakshmi",
    company: "StackForge",
    quote: "The structured approach to co-founder matching took all the guesswork out. We're now building India's next developer platform.",
    raised: "₹1.2Cr Angel",
    rating: 4,
    avatarColor: "#4527A0",
  },
];
