import type { ApplicationType } from "@/types/type";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { updateApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ApplicationCard = ({
  application,
  isCandidate = false,
  fetchJob,
}: {
  application: ApplicationType;
  isCandidate?: boolean;
  fetchJob: () => void;
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application.resume;
    link.download = `${application.name}_resume.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const {  fn, loading } = useFetch(updateApplicationStatus, {
    job_id: application.job_id,
    application_id: application.id,
  });

  const handleStatusChange = (status: string) => {
    fn(status).then(()=>fetchJob());
  };
  return (
    <Card>
      {loading && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness />
            {application?.experience} years of experience
          </div>
          <div className="flex gap-2 items-center">
            <School />
            {application?.education}
          </div>{" "}
          <div className="flex gap-2 items-center">
            <Boxes />
            Skills {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status : {application?.status}
          </span>
        ) : (
          <Select value={application.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application updateApplicationStatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
