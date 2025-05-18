import { getCompanies } from "@/api/apiCompanies";
import { deleteJob, deleteMyJob, getJobs, saveJob } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import type { CompanyType, SingleJobType } from "@/types/type";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { State } from "country-state-city";
const JobListingPage = () => {
  const { isLoaded, user } = useUser();
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState<number | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, error, loading, fn } = useFetch<SingleJobType[]>(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  const { data: companiesData, fn: companiesFn } = useFetch<CompanyType[]>(
    getCompanies,
    {}
  );

  const { fn: saveJobFn } = useFetch(saveJob, {});
  const { fn: deleteJobFn } = useFetch(deleteJob, {});
  const {
    loading: loadingDelete,

    fn: deleteFn,
  } = useFetch(deleteMyJob, {
    user_id: user?.id,
  });
  useEffect(() => {
    if (isLoaded) fn();
  }, [isLoaded, location, company_id, searchQuery]);

  useEffect(() => {
    if (isLoaded) companiesFn();
  }, [isLoaded]);
  if (!isLoaded) {
    return (
      <BarLoader className="mb-4  text-center" width={"100%"} color="#36d7b7" />
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    let query = formData.get("search-query") as string;
    query = query.trim();
    query ? setSearchQuery(query) : setSearchQuery("");
  };

  const handleJobSave = (jobId: number, isSaved: boolean | undefined) => {
    !isSaved
      ? saveJobFn({ job_id: jobId.toString(), user_id: user?.id }).then(() => {
          fn();
        })
      : deleteJobFn({ job_id: jobId.toString(), user_id: user?.id }).then(
          () => {
            fn();
          }
        );
  };

  const handleDelete = (jobId: number) => {
    deleteFn({ user_id: user?.id, job_id: jobId.toString() }).then(() => {
      fn({ user_id: user?.id });
    });
  };

  return (
    <div>
      <h1 className="text-gray-300 font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>
      <form
        onSubmit={handleSearch}
        className="h-14 flex w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search job by Title..."
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Select
            value={location}
            onValueChange={(value) => setLocation(value)}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map((state) => (
                  <SelectItem key={state.name} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select
            value={company_id as string}
            onValueChange={(value) => setCompany_id(parseInt(value))}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companiesData?.map((comp) => (
                  <SelectItem key={comp.id} value={comp.id.toString()}>
                    {comp.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => {
            setLocation("");
            setCompany_id("");
            setSearchQuery("");
          }}
          className="h-11 md:w-auto"
          variant="destructive"
        >
          Clear Filters
        </Button>
      </div>

      {loading && (
        <BarLoader
          className="mt-4  text-center"
          width={"100%"}
          color="#36d7b7"
        />
      )}
      {loading === false && (
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.length ? (
            data.map((job: SingleJobType) => (
              <JobCard
                isMyJob={job.recruiter_id.toString() === user?.id.toString()}
                savedInit={
                  job.saved &&
                  job.saved.length > 0 &&
                  job.saved.find(
                    (saved) => saved.user_id.toString() === user?.id.toString()
                  )
                    ? true
                    : false
                }
                key={job.id}
                {...job}
                onJobSaved={handleJobSave}
                loadingDelete={loadingDelete}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            <div>No jobs found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListingPage;
