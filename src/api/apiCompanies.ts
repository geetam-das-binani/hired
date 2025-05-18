import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function getCompanies(token: string, ...args: any[]) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");
  if (error || !data) {
    console.error("Error fetching companies", error);
    return [];
  }
  return data;
}

export async function addCompany(
  token: string,
  _options: any,
  companyData: { name: string; logo: string }
) {
  const supabase = await supabaseClient(token);
  const random = Math.floor(Math.random() * 90000);

  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) {
    console.error("Error uploading logo", storageError);
    return null;
  }

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;
  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url,
      },
    ])
    .select();
  if (error || !data) {
    console.error("Error fetching companies", error);
    return [];
  }
  return data;
}
