import type { SingleJobType } from "@/types/type";

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
import { BarLoader } from "react-spinners";

type JobCardProps = SingleJobType & {
  isMyJob?: boolean;
  savedInit?: boolean;
  onJobSaved?: (jobId: number, isSaved?: boolean) => void;
  handleDelete?: (jobId: number) => void;
  loadingDelete?: boolean;
};

const JobCard = ({
  id,
  title,
  description,
  location,
  company,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
  handleDelete = () => {},
  loadingDelete = false,
}: JobCardProps) => {
  return (
    <Card className="flex flex-col">
      {loadingDelete && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {title}
          {isMyJob && (
            <Trash2Icon
              onClick={() => handleDelete(id!)}
              className="text-red-300 cursor-pointer"
            />
          )}
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
          onClick={() => {
            if (!id) return;
            onJobSaved(id!, savedInit);
          }}
          size={20}
          stroke="
          
        red"
          className="cursor-pointer"
          fill={savedInit ? "red" : ""}
        />
      </CardFooter>
    </Card>
  );
};

export default JobCard;
