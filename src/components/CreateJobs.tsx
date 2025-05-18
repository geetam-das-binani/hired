import { deleteMyJob, getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";

const CreateJobs = () => {
  const { user, isLoaded } = useUser();
  const {
    data: myJobs,
    loading,
    error,
    fn,
  } = useFetch(getMyJobs, {
    user_id: user?.id,
  });
  const {
    loading: loadingDelete,

    fn: deleteFn,
  } = useFetch(deleteMyJob, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded) fn({ user_id: user?.id });
  }, [isLoaded]);
  if (!isLoaded || loading) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDelete = (jobId: number) => {
    deleteFn({ user_id: user?.id, job_id: jobId.toString() }).then(() => {
      fn({ user_id: user?.id });
    });
  };
  return (
    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      {myJobs?.map((job) => (
        <JobCard
          isMyJob={true}
          key={job.id}
          {...job}
          handleDelete={handleDelete}
          loadingDelete={loadingDelete}
        />
      ))}
    </div>
  );
};

export default CreateJobs;
