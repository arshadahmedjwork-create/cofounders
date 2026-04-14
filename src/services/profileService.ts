import { supabase } from "../lib/supabase";
import { UserProfile } from "../types/profile";
import { Profile } from "../data/profiles";

export const saveProfile = async (userId: string, data: UserProfile): Promise<{ success: boolean; id: string | null; error?: any }> => {
  // Map form data to database columns
  const insertData = {
    id: userId,
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    role: data.role,
    industry: data.industry,
    city: data.city,
    linkedin: data.linkedin,
    looking_for: data.lookingFor,
    idea: data.idea,
    skills: data.selectedSkills,
    avatar_url: data.avatarUrl,
    experience: data.experience,
    work: data.work,
    time_commitment: data.timeCommitment,
    education_history: data.educationHistory || [],
    experience_history: data.experienceHistory || [],
    // New fields
    user_type: data.userType,
    full_bio: data.fullBio,
    company_name: data.companyName,
    company_stage: data.companyStage,
    company_description: data.companyDescription,
    company_logo: data.companyLogo,
    discovery_preference: data.discoveryPreference,
  };

  const { data: result, error } = await supabase
    .from("user_profiles")
    .upsert([insertData])
    .select()
    .single();

  if (error) {
    console.error("Error saving profile:", error);
    return { success: false, id: null, error: error.message };
  }

  return { success: true, id: result?.id || null };
};

export const getProfileById = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // Ignore 'no rows found' errors
      console.error("Error fetching profile by ID:", error);
    }
    return null;
  }

  const row = data;
  return {
    id: row.id,
    name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Anonymous User',
    role: row.role || 'Founder',
    location: row.city || 'Unknown Location',
    domain: row.industry || 'General',
    tags: Array.isArray(row.skills) ? row.skills : (typeof row.skills === 'string' ? [row.skills] : []),
    stage: row.company_stage || row.stage || 'Idea',
    matchPercent: row.match_percent || Math.floor(Math.random() * 30 + 70),
    avatarColor: row.avatar_color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 40%)`,
    avatarUrl: row.avatar_url,
    bio: row.full_bio || row.experience || 'Ready to build something amazing.',
    work: row.work || 'Independent Founder',
    timeCommitment: row.time_commitment || '20+ hrs/week',
    educationHistory: row.education_history || [],
    experienceHistory: row.experience_history || [],
    lookingFor: row.looking_for || 'Co-founder',
    userType: row.user_type,
    companyName: row.company_name,
    companyDescription: row.company_description,
    companyLogo: row.company_logo,
    discoveryPreference: row.discovery_preference,
  };
};

export const getProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*");

  if (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }

  // Map DB structure back to UI Profile interface
  const dbProfiles = (data || []).map((row: any) => ({
    id: row.id,
    name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Anonymous User',
    role: row.role || 'Founder',
    location: row.city || 'Unknown Location',
    domain: row.industry || 'General',
    tags: Array.isArray(row.skills) ? row.skills : (typeof row.skills === 'string' ? [row.skills] : []),
    stage: row.company_stage || row.stage || 'Idea',
    matchPercent: row.match_percent || Math.floor(Math.random() * 30 + 70),
    avatarColor: row.avatar_color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 40%)`,
    avatarUrl: row.avatar_url,
    bio: row.full_bio || row.experience || 'Ready to build something amazing.',
    work: row.work || 'Independent Founder',
    timeCommitment: row.time_commitment || '20+ hrs/week',
    educationHistory: row.education_history || [],
    experienceHistory: row.experience_history || [],
    lookingFor: row.looking_for || 'Co-founder',
    userType: row.user_type,
    companyName: row.company_name,
    companyDescription: row.company_description,
    companyLogo: row.company_logo,
    discoveryPreference: row.discovery_preference,
  }));

  return dbProfiles;
};
