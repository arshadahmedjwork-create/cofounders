import { supabase } from "../lib/supabase";

export interface AssessmentResult {
  id?: string;
  user_email: string;
  answers: Record<number, string | number>;
  created_at?: string;
}

export const saveAssessment = async (userEmail: string, answers: Record<number, string | number>): Promise<{ success: boolean; error?: string }> => {
  try {
    // 1. Save the raw answers
    const { error: assessmentError } = await supabase
      .from("assessments")
      .insert([
        {
          user_email: userEmail,
          answers: answers,
          created_at: new Date().toISOString(),
        },
      ]);

    if (assessmentError) throw assessmentError;

    // 2. Calculate DNA & Compatibility scores based on Synapse Test answers
    // Mapping: A=90, B=75, C=55, D=40 for MC. Scales: (val/7)*100
    const getVal = (id: number) => {
      const val = answers[id];
      if (typeof val === 'number') return (val / 7) * 100;
      if (val === 'A') return 92;
      if (val === 'B') return 78;
      if (val === 'C') return 58;
      if (val === 'D') return 45;
      return 70; // Default
    };

    const dnaRisk = Math.round((getVal(1) + getVal(5) + getVal(9)) / 3);
    const dnaSpeed = Math.round((getVal(2) + getVal(4) + getVal(12)) / 3);
    const dnaLeadership = Math.round((getVal(3) + getVal(6) + getVal(13)) / 3);
    const dnaCommunication = Math.round((getVal(8) + getVal(11) + getVal(15)) / 3);

    const compSkill = Math.round((getVal(12) + getVal(16) + getVal(17)) / 3);
    const compVision = Math.round((getVal(10) + getVal(14) + getVal(19)) / 3);
    const compWorkStyle = Math.round((getVal(4) + getVal(7) + getVal(18)) / 3);
    const compAmbition = Math.round((getVal(2) + getVal(19) + getVal(20)) / 3);

    // 3. Update the user_profile with these calculated scores
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({
        dna_risk: dnaRisk,
        dna_speed: dnaSpeed,
        dna_leadership: dnaLeadership,
        dna_communication: dnaCommunication,
        comp_skill: compSkill,
        comp_vision: compVision,
        comp_work_style: compWorkStyle,
        comp_ambition: compAmbition,
        updated_at: new Date().toISOString()
      })
      .eq("email", userEmail);

    if (profileError) {
      console.warn("Could not update profile with scores:", profileError);
      // We don't throw here because the assessment was saved successfully
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error saving assessment:", error);
    return { success: false, error: error.message || "An unknown error occurred." };
  }
};

export const getLastAssessment = async (userEmail: string): Promise<AssessmentResult | null> => {
  try {
    const { data, error } = await supabase
      .from("assessments")
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
