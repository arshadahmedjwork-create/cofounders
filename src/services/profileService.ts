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
    // New matching fields
    user_type: data.userType,
    full_bio: data.fullBio,
    company_name: data.companyName,
    company_stage: data.companyStage,
    company_description: data.companyDescription,
    company_logo: data.companyLogo,
    discovery_preference: data.discoveryPreference,
    
    // Structured Matching
    intent: data.intent,
    startup_goal: data.startupGoal,
    startup_stage: data.startupStage,
    what_you_cover: data.whatYouCover,
    what_you_need: data.whatYouNeed,
    cofounder_type: data.cofounderType,
    compensation: data.compensation,
    non_negotiables: data.nonNegotiables,
    aspirant_goal: data.aspirantGoal,
    preferred_stage: data.preferredStage,
    work_style: data.workStyle,
    survival_time: data.survivalTime,
    equity_expectation: data.equityExpectation,
    domain_tags: data.domainTags,
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
    if (error.code !== 'PGRST116') {
      console.error("Error fetching profile by ID:", error);
    }
    return null;
  }

  // Check for Synapse Test
  const { data: assessment } = await supabase
    .from("assessments")
    .select("id")
    .eq("user_email", data.email)
    .maybeSingle();

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
    work: (row.experience_history?.[0]?.role ? `${row.experience_history[0].role} @ ${row.experience_history[0].company}` : row.work) || row.role || row.user_type || 'Independent Founder',
    timeCommitment: row.time_commitment || '20+ hrs/week',
    educationHistory: row.education_history || [],
    experienceHistory: row.experience_history || [],
    lookingFor: row.looking_for || 'Co-founder',
    userType: row.user_type,
    companyName: row.company_name,
    companyDescription: row.company_description,
    companyLogo: row.company_logo,
    discoveryPreference: row.discovery_preference,
    intent: row.intent,
    startupGoal: row.startup_goal,
    startupStage: row.startup_stage,
    whatYouCover: row.what_you_cover,
    whatYouNeed: row.what_you_need,
    cofounderType: row.cofounder_type,
    compensation: row.compensation,
    nonNegotiables: row.non_negotiables,
    aspirantGoal: row.aspirant_goal,
    preferredStage: row.preferred_stage,
    workStyle: row.work_style,
    survivalTime: row.survival_time,
    equityExpectation: row.equity_expectation,
    domainTags: row.domain_tags,
    hasTakenSynapse: !!assessment,
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
    work: (row.experience_history?.[0]?.role ? `${row.experience_history[0].role} @ ${row.experience_history[0].company}` : row.work) || row.role || row.user_type || 'Independent Founder',
    timeCommitment: row.time_commitment || '20+ hrs/week',
    educationHistory: row.education_history || [],
    experienceHistory: row.experience_history || [],
    lookingFor: row.looking_for || 'Co-founder',
    userType: row.user_type,
    companyName: row.company_name,
    companyDescription: row.company_description,
    companyLogo: row.company_logo,
    discoveryPreference: row.discovery_preference,
    intent: row.intent,
    startupGoal: row.startup_goal,
    startupStage: row.startup_stage,
    whatYouCover: row.what_you_cover,
    whatYouNeed: row.what_you_need,
    cofounderType: row.cofounder_type,
    compensation: row.compensation,
    nonNegotiables: row.non_negotiables,
    aspirantGoal: row.aspirant_goal,
    preferredStage: row.preferred_stage,
    workStyle: row.work_style,
    survivalTime: row.survival_time,
    equityExpectation: row.equity_expectation,
    domainTags: row.domain_tags,
  }));

  return dbProfiles;
};
