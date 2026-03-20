import { supabase } from "../lib/supabase";
import { UserProfile } from "../types/profile";
import { Profile } from "../data/profiles";

export const saveProfile = async (data: UserProfile): Promise<{ success: boolean; id: string | null }> => {
  // Map form data to database columns
  const insertData = {
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
  };

  const { data: result, error } = await supabase
    .from("user_profiles")
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error("Error saving profile:", error);
    throw error;
  }

  return { success: true, id: result?.id || null };
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
  return (data || []).map((row: any) => ({
    id: row.id,
    name: `${row.first_name} ${row.last_name}`,
    role: row.role,
    location: row.city,
    domain: row.industry,
    tags: row.skills || [],
    stage: row.stage || 'Idea',
    matchPercent: row.match_percent || 70,
    avatarColor: row.avatar_color || '#1E293B',
    bio: row.bio || row.idea || 'No bio provided.',
    lookingFor: row.looking_for || 'Co-founder',
  }));
};
