import { getJobs } from "@/api/apiJobs";
import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";

const JobListingPage = () => {
  const { session } = useSession();

  const fetchJobs = async () => {
    try {
      const supabaseToken = await session?.getToken({
        template: "supabase",
      });
      if (!supabaseToken) {
        throw new Error("No token found");
      }

      const data = await getJobs(supabaseToken, {});
      console.log(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  return <div>JobListingPage</div>;
};

export default JobListingPage;
