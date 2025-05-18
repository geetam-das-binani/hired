import type { Jobs, SingleJobType } from "@/types/type";
import supabaseClient from "@/utils/supabase";

export async function getJobs(
  token: string,
  { location, company_id, searchQuery }: Jobs,
  ..._args: any[]
): Promise<SingleJobType[] | []> {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, company:companies(name,logo_url),saved:saved_jobs(user_id,id)");
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

export async function saveJob(
  token: string,
  _options: {},
  { job_id, user_id }: { job_id: string; user_id: string }
) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .insert([{ job_id, user_id }])
    .select();
  if (error || !data) {
    console.error("Error saving jobs", error);
    return null;
  }
  return data;
}

export async function deleteJob(
  token: string,
  _options: {},
  { job_id, user_id }: { job_id: string; user_id: string }
) {
  const supabase = await supabaseClient(token);

  const { data: existing } = await supabase
    .from("saved_jobs")
    .select("*")
    .eq("job_id", job_id)
    .eq("user_id", user_id);

    console.log(existing)

  const { data, error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("job_id", job_id)
    .eq("user_id", user_id)
    .select();

  if (error || !data) {
    console.error("Delete error:", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(
  token: string,
  options: {
    user_id: string;
  }
) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("* , job:jobs(*,company:companies(name,logo_url))")
    .eq("user_id", options.user_id);
  if (error || !data) {
    console.error("Error fetching saving jobs", error);
    return null;
  }
  return data;
}

export async function getMyJobs(
  token: string,
  options: {
    user_id: string;
  }
) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select("* , company:companies(name,logo_url)")
    .eq("recruiter_id", options.user_id);
  if (error || !data) {
    console.error("Error fetching my jobs", error);
    return null;
  }
  return data;
}

export async function deleteMyJob(
  token: string,
  _options: any,
  { job_id, user_id }: { job_id: string; user_id: string }
) {
  const supabase = await supabaseClient(token);

  // First delete from saved_jobs where job_id matches
  const { error: savedJobsError } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("job_id", job_id);

  if (savedJobsError) {
    console.error("Error deleting from saved_jobs", savedJobsError);
    return null;
  }

  const { error: applicationsError } = await supabase
    .from("applications")
    .delete()
    .eq("job_id", job_id);
    
  if (applicationsError) {
    console.error("Error deleting from applications", applicationsError);
    return null;
  }

  // Now delete the job
  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("recruiter_id", user_id)
    .eq("id", job_id);

  if (error || !data) {
    console.error("Error deleting job", error);
    return null;
  }

  return data;
}
