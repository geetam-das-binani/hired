import { deleteJob, getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import useFetch from "@/hooks/useFetch";
import type { SavedJobType } from "@/types/type";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobsPage = () => {
  const { user, isLoaded } = useUser();
  const { loading, error, data, fn } = useFetch(getSavedJobs, {
    user_id: user?.id,
  });
  const { fn: deleteJobFn } = useFetch(deleteJob, {});

  useEffect(() => {
    if (isLoaded) fn({ user_id: user?.id });
  }, [isLoaded]);

  if (!isLoaded || loading) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleJobSave = (jobId: number) => {
    deleteJobFn({ job_id: jobId.toString(), user_id: user?.id }).then(() => {
      fn();
    });
  };

  return (
    <div>
      <h1 className="text-gray-300 font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loading === false && (
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.length ? (
            data.map((job: SavedJobType) => (
              <JobCard
                savedInit={true}
                key={job.id}
                {...job.job}
                onJobSaved={handleJobSave}
              />
            ))
          ) : (
            <div>No saved jobs found eye 👁️👁️</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
