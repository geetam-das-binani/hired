import type { ApplicationType, SingleJobType } from "@/types/type";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyToJob } from "@/api/apiApplications";
import useFetch from "@/hooks/useFetch";
const jobApplySchema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be atleast 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .custom<FileList>()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      {
        message: "PDF or Word Document are allowed",
      }
    ),
});

type jobType = z.infer<typeof jobApplySchema>;
interface JobProps {
  user: any;
  job: SingleJobType | null | undefined;
  applied: ApplicationType | undefined;
  fetchJob: () => void;
}
const ApplyJobDrawer = ({ applied, fetchJob, user, job }: JobProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<jobType>({
    resolver: zodResolver(jobApplySchema),
  });
  const {
    loading: loadingApply,
    fn: fnApply,
    error: errorApply,
  } = useFetch(applyToJob, {});
  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger>
        <Button
          disabled={!job?.isOpen || (applied ? true : false)}
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please fill the form below.</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={}
          className="flex flex-col p-4 pb-0 space-y-2"
        >
          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1"
            {...register("education", { valueAsNumber: true })}
          />
          {errors?.["experience"] && (
            <p className="text-red-500">{errors["experience"].message}</p>
          )}
          <Input
            type="text"
            placeholder="Skills (Comma Seperated)"
            className="flex-1"
            {...register("skills")}
          />
          {errors?.["skills"] && (
            <p className="text-red-500">{errors["skills"].message}</p>
          )}
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="post-graduate" />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors?.["education"] && (
            <p className="text-red-500">{errors["education"].message}</p>
          )}

          <Input
            type="file"
            accept=".pdf ,. doc, .docx"
            className="flex-1 file:text-gray-500"
            {...register("resume")}
          />
          {errors?.["resume"] && (
            <p className="text-red-500">{errors["resume"].message}</p>
          )}
          <Button variant="blue" size="lg" type="submit">
            Apply
          </Button>
        </form>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
