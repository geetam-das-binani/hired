import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplyJobDrawer from "@/components/ApplyJobDrawer";
import ApplicationCard from "@/components/ApplicationCard";
import type { ApplicationType } from "@/types/type";
const JobPage = () => {
  const { user, isLoaded } = useUser();
  const { id: job_id } = useParams();
  const {
    data: job,
    fn,
    loading,
    error,
  } = useFetch(getSingleJob, {
    job_id,
  });

  const { loading: loadingHiringStatus, fn: updateFn } = useFetch(
    updateHiringStatus,
    {
      job_id,
    }
  );

  const handleStatusChange = (value: string) => {
    const isOpen = value === "true";
    updateFn(isOpen).then(() => fn());
  };
  useEffect(() => {
    if (isLoaded) fn();
  }, [isLoaded]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!isLoaded || loading) {
    return (
      <BarLoader className="mb-4  text-center" width={"100%"} color="#36d7b7" />
    );
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="text-gray-300 font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company.logo_url} alt={job?.title} className="h-12" />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPin />
          {job?.location}
        </div>
        <div className="flex gap-x-24">
          <Briefcase /> {job?.applications.length} Applicants
        </div>
        <div className="flex gap-x-24">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {job?.recruiter_id.toString() === user?.id ? (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
          >
            <SelectValue
              placeholder={`Hiring Status  ${
                job?.isOpen ? "(Open)" : "(Close)"
              }`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Open</SelectItem>
            <SelectItem value="false">Close</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <></>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>
      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={job?.requirements.replace(/[-]/gi, "• ")}
        className="bg-transparent sm:text-lg"
      />

      {job?.recruiter_id.toString() !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fn}
          applied={job?.applications.find(
            (application) => application.candidate_id === user?.id
          )}
        />
      )}

      {job?.recruiter_id.toString() === user?.id &&
        job?.applications &&
        job?.applications.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Aplications</h2>
            {job.applications.map((application) => (
              <ApplicationCard
              fetchJob={fn}
              key={application.id} application={application} />
            ))}
          </div>
        )}
    </div>
  );
};

export default JobPage;
