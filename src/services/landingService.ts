import { supabase } from "../lib/supabase";
import { PlatformStat, TrustUser } from "../types/landing";

export const getLandingStats = async (): Promise<PlatformStat[]> => {
  const { data, error } = await supabase
    .from("landing_stats")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching landing stats:", error);
    return [];
  }
  return data || [];
};

export const getTrustUsers = async (): Promise<TrustUser[]> => {
  const { data, error } = await supabase
    .from("trust_users")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching trust users:", error);
    return [];
  }
  
  // Map snake_case to camelCase
  return (data || []).map((row: any) => ({
    id: row.id,
    initials: row.initials,
    bgColor: row.bg_color,
  }));
};
