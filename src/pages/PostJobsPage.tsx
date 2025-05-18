import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/useFetch";
import { addNewJob } from "@/api/apiApplications";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import type { CompanyType } from "@/types/type";
import { getCompanies } from "@/api/apiCompanies";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import AddCompanyDrawer from "@/components/AddCompanyDrawer";

const addJobSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  company_id: z.string().min(1, { message: "Company is required" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

type addJobType = z.infer<typeof addJobSchema>;

const PostJobsPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const {
    reset,
    formState: { errors },
    handleSubmit,
    register,
    control,
  } = useForm<addJobType>({
    resolver: zodResolver(addJobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      company_id: "",
      requirements: "",
    },
  });
  const {
    loading,
    error,
    fn: addJobFn,
    data: createJob,
  } = useFetch(addNewJob, {});
  const {
    data: companies,
    fn: companiesFn,
    loading: loadingCompanies,
  } = useFetch<CompanyType[]>(getCompanies, {});

  const onSubmit = (values: addJobType) => {
    addJobFn({
      ...values,
      recruiter_id: user?.id,
      company_id: Number(values.company_id),
      isOpen: true,
    }).then(() => {
      reset();
    });
  };
  useEffect(() => {
    if (isLoaded) companiesFn();
  }, [isLoaded]);

  useEffect(() => {
    if (createJob && createJob?.length > 0) {
      navigate("/jobs");
    }
  }, [loading]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to={"/jobs"} />;
  }
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find(
                          (com) => com.id.toString() === field.value.toString()
                        )?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddCompanyDrawer fetchCompanies={companiesFn} />
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {loading && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJobsPage;
