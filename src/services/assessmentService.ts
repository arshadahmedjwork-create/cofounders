import { supabase } from "../lib/supabase";

export interface AssessmentResult {
  id?: string;
  user_email: string;
  answers: Record<number, string | number>;
  created_at?: string;
}

export const saveAssessment = async (userEmail: string, answers: Record<number, string | number>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("synapse_assessments")
      .insert([
        {
          user_email: userEmail,
          answers: answers,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error saving assessment:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
};

export const getLastAssessment = async (userEmail: string): Promise<AssessmentResult | null> => {
  try {
    const { data, error } = await supabase
      .from("synapse_assessments")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as AssessmentResult;
  } catch (error: any) {
    console.error("Error fetching last assessment:", error);
    return null;
  }
};
