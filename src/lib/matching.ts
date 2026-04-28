import { UserProfile } from "@/types/profile";
import { Profile } from "@/data/profiles";

export function calculateMatchScore(currentUser: UserProfile, targetProfile: Profile): number {
  let score = 50; // Base score

  // 1. Intent Compatibility
  if (currentUser.intent === 'building' && targetProfile.intent === 'joining') score += 15;
  if (currentUser.intent === 'joining' && targetProfile.intent === 'building') score += 15;

  // 2. Skills vs Needs
  if (currentUser.intent === 'building') {
    const needs = currentUser.whatYouNeed || [];
    const targetSkills = targetProfile.tags || [];
    const matchedSkills = needs.filter(n => targetSkills.some(ts => ts.toLowerCase().includes(n.toLowerCase())));
    score += matchedSkills.length * 10;
  } else {
    const skills = currentUser.selectedSkills || [];
    const targetNeeds = targetProfile.whatYouNeed || [];
    const matchedNeeds = skills.filter(s => targetNeeds.some(tn => tn.toLowerCase().includes(s.toLowerCase())));
    score += matchedNeeds.length * 10;
  }

  // 3. Stage Compatibility
  if (currentUser.startupStage && targetProfile.preferredStage) {
    if (currentUser.startupStage === targetProfile.preferredStage) score += 10;
  }
  if (currentUser.preferredStage && targetProfile.startupStage) {
    if (currentUser.preferredStage === targetProfile.startupStage) score += 10;
  }

  // 4. Time Commitment Alignment
  if (currentUser.timeCommitment === targetProfile.timeCommitment) score += 5;

  // 5. Compensation Alignment
  if (currentUser.compensation === targetProfile.compensation) score += 5;

  return Math.min(Math.max(score, 0), 99);
}
