import CreateApplications from "@/components/CreateApplications";
import CreateJobs from "@/components/CreateJobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobsPage = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }
  return (
    <div>
      <h1 className="text-gray-300 font-extrabold text-6xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "candidate"
          ? "Your Applications"
          : "Your Jobs"}
      </h1>
    {  user?.unsafeMetadata?.role === "candidate" ? (
        <CreateApplications/>
      ) : (
        <CreateJobs/>
      )}
    </div>
  );
};

export default MyJobsPage;
