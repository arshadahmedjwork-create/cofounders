import { supabase } from "../lib/supabase";
import { UserProfile } from "../types/profile";
import { Profile, DEMO_PROFILES } from "../data/profiles";

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
  };

  const { data: result, error } = await supabase
    .from("user_profiles")
    .upsert([insertData]) // Use upsert in case they are re-onboarding
    .select()
    .single();

  if (error) {
    console.error("Error saving profile:", error);
    return { success: false, id: null, error: error.message };
  }

  return { success: true, id: result?.id || null };
};

export const getProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*");

  if (error) {
    console.error("Error fetching profiles:", error);
    return DEMO_PROFILES; // Return demo profiles at least
  }

  // Map DB structure back to UI Profile interface
  const dbProfiles = (data || []).map((row: any) => ({
    id: row.id,
    name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Anonymous User',
    role: row.role || 'Founder',
    location: row.city || 'Unknown Location',
    domain: row.industry || 'General',
    tags: Array.isArray(row.skills) ? row.skills : (typeof row.skills === 'string' ? [row.skills] : []),
    stage: row.stage || 'Idea',
    matchPercent: row.match_percent || Math.floor(Math.random() * 30 + 70),
    avatarColor: row.avatar_color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 40%)`,
    avatarUrl: row.avatar_url,
    bio: row.experience || row.bio || row.idea || 'Ready to build something amazing.',
    lookingFor: row.looking_for || 'Co-founder',
  }));

  // Merge with Demo Profiles to ensure demo connections show names
  const allProfiles = [...DEMO_PROFILES];
  dbProfiles.forEach(p => {
    const existingIndex = allProfiles.findIndex(dp => dp.id === p.id);
    if (existingIndex !== -1) {
      allProfiles[existingIndex] = p; // DB profile overwrites demo if ID matches
    } else {
      allProfiles.push(p);
    }
  });

  return allProfiles;
};
