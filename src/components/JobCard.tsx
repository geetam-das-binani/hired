import type { SingleJobType } from "@/types/type";
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

type JobCardProps = SingleJobType & {
  isMyJob?: boolean;
  savedInit?: boolean;
  onJobSaved?: (jobId:number) => void;
};

const JobCard = ({
  id,
  title,
  description,
  location,
  company_id,
  requirements,
  isOpen,
  created_at,
  recruiter_id,
  company,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}: JobCardProps) => {
  const { user } = useUser();
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {title}
          {isMyJob && <Trash2Icon className="text-red-300 cursor-pointer" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {company && (
            <img src={company.logo_url} alt={company.name} className="h-6" />
          )}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {location}
          </div>
        </div>
        <hr />
        {description && description.slice(0, description.indexOf("."))}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/job/${id}`} className="flex-1">
          <Button variant={"secondary"} className="w-full">
            More Details
          </Button>
        </Link>
        <Heart
          size={20}
          stroke="
        red"
          fill="red"
        />
      </CardFooter>
    </Card>
  );
};

export default JobCard;
