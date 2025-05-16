import supabaseClient from "@/utils/supabase";

export async function getCompanies(token: string, ...args: any[]) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");
  if (error || !data) {
    console.error("Error fetching companies", error);
    return [];
  }
  return data;
}
