import type { Jobs, SingleJobType } from "@/types/type";
import supabaseClient from "@/utils/supabase";

export async function getJobs(
  token: string,
  { location, company_id, searchQuery }: Jobs,
  ...args: any[]
): Promise<SingleJobType[] | []> {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, company:companies(name,logo_url),saved:saved_jobs(id)");
  if (location) {
    query = query.eq("location", location);
  }
  if (company_id) {
    query = query.eq("company_id", company_id);
  }
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }
  const { data, error } = await query;
  if (error || !data) {
    console.error("Error fetching jobs", error);
    return [];
  }
  return data;
}

export async function getSingleJob(
  token: string,
  { job_id }: { job_id: string }
): Promise<SingleJobType | null> {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "* , company:companies(name,logo_url) , applications:applications(*)"
    )
    .eq("id", job_id)
    .single();
  if (error || !data) {
    console.error("Error fetching job ", error);
    return null;
  }
  return data;
}

export async function updateHiringStatus(
  token: string,
  { job_id }: { job_id: string },
  isOpen: boolean
): Promise<SingleJobType | null> {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select()
    .single();
  if (error || !data) {
    console.error("Error updating job status", error);
    return null;
  }
  return data;
}
