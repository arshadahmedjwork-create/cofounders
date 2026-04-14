export interface FounderPost {
  id: string;
  userId: string;
  title: string;
  roles: string[];
  description: string;
  package: string;
  companyName: string;
  companyLogo?: string;
  companyLinkedin?: string;
  createdAt: string;
  // Optional for display
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
}
