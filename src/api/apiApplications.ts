import type { ApplicationType } from "@/types/type";
import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(
  token: string,
  jobData: ApplicationType
): Promise<ApplicationType[] | null> {
  const supabase = await supabaseClient(token);
  const random = Math.floor(Math.random() * 90000);
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
