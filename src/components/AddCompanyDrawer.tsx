import { addCompany } from "@/api/apiCompanies";
import useFetch from "@/hooks/useFetch";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BarLoader } from "react-spinners";

const addCompanySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  logo: z
    .custom<FileList>()
    .refine(
      (file) =>
        file instanceof FileList &&
        file.length > 0 &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only PNG or JPEG images are allowed",
      }
    ),
});

type addCompanyType = z.infer<typeof addCompanySchema>;
const AddCompanyDrawer = ({
  fetchCompanies,
}: {
  fetchCompanies: () => void;
}) => {
  const {
    
    loading: loadingAddCompany,
    error: errorAddCompany,
    fn,
  } = useFetch(addCompany, {});
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<addCompanyType>({
    resolver: zodResolver(addCompanySchema),
    defaultValues: {
      name: "",
      logo: undefined,
    },
  });

  const onSubmit = (data: addCompanyType) => {
    fn({
      name: data.name,
      logo: data.logo?.[0],
    }).then(() => {
      fetchCompanies();
      reset();
    });
  };
  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size={"sm"} variant={"secondary"}>
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>
        <form className="flex gap-2 p-4 pb-0">
          <Input placeholder="Company name" {...register("name")} />
          {errors?.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
          <Input
            type="file"
            accept="image/*"
            className="file:text-gray-500"
            {...register("logo")}
          />
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant={"destructive"}
            className="w-40"
          >
            Add
          </Button>
        </form>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
        {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}
        {errorAddCompany && <p className="text-red-500">{errorAddCompany}</p>}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
