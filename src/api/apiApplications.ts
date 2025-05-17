import type { ApplicationType, SingleJobType } from "@/types/type";
import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(
  token: string,
  options: any,
  jobData: ApplicationType
): Promise<ApplicationType[] | null> {
  const supabase = await supabaseClient(token);
  const random = Math.floor(Math.random() * 90000);
  console.log(jobData);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) {
    console.error("Error uploading Resume", storageError);
    return null;
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([{ ...jobData, resume }])
    .select();
  if (error || !data) {
    console.error("Error applying to job", error);
    return null;
  }
  return data;
}

export async function updateApplicationStatus(
  token: string,
  { job_id, application_id }: { job_id: string; application_id: string },
  status: string
): Promise<ApplicationType[] | null> {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .eq("id", application_id)
    .select();
  if (error || !data) {
    console.error("Error updating application status", error);
    return null;
  }
  return data;
}

export async function addNewJob(
  token: string,
  options: any,
  jobData: SingleJobType
) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("jobs")
  .insert({...jobData})
    
  if (error || !data) {
    console.error("Error adding jobs", error);
    return null;
  }
  return data;
}
