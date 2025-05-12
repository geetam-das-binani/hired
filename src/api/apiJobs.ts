import type { Jobs } from "@/types/type";
import supabaseClient from "@/utils/supabase";

export async function getJobs(
  token: string,
  { location, company_id, searchQuery }: Jobs
) {
  const supabase = await supabaseClient(token);
  let query = supabase.from("jobs").select("*");
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching jobs", error);
    return null;
  }
  return data;
}
