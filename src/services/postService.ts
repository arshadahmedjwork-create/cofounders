import { supabase } from "../lib/supabase";
import { FounderPost } from "../types/post";

export const createPost = async (post: Omit<FounderPost, 'id' | 'createdAt'>): Promise<{ success: boolean; id: string | null; error?: string }> => {
  const { data, error } = await supabase
    .from("cofounder_posts")
    .insert([{
      user_id: post.userId,
      title: post.title,
      roles: post.roles,
      description: post.description,
      package: post.package,
      company_name: post.companyName,
      company_logo: post.companyLogo,
      company_linkedin: post.companyLinkedin,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    return { success: false, id: null, error: error.message };
  }

  return { success: true, id: data.id };
};

export const getPosts = async (): Promise<FounderPost[]> => {
  const { data, error } = await supabase
    .from("cofounder_posts")
    .select(`
      *,
      user_profiles!user_id (
        first_name,
        last_name,
        avatar_url,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    roles: row.roles || [],
    description: row.description,
    package: row.package,
    companyName: row.company_name,
    companyLogo: row.company_logo,
    companyLinkedin: row.company_linkedin,
    createdAt: row.created_at,
    userName: `${row.user_profiles?.first_name || ''} ${row.user_profiles?.last_name || ''}`.trim(),
    userAvatar: row.user_profiles?.avatar_url,
    userEmail: row.user_profiles?.email,
  }));
};
