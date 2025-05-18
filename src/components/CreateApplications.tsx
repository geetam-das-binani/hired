import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";

const CreateApplications = () => {
  const { user, isLoaded } = useUser();
  const { data, loading, error, fn } = useFetch(getApplications, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded) fn({ user_id: user?.id });
  }, [isLoaded]);
  if (!isLoaded || loading) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col space-y-4">
      {data?.map((application) => (
        <ApplicationCard
          fetchJob={fn}
          key={application.id}
          application={application}
          isCandidate={true}
        />
      ))}
    </div>
  );
};

export default CreateApplications;
