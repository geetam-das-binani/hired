import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
const OnBoardingPage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.unsafeMetadata.role) {
      navigate(
        user?.unsafeMetadata.role === "recruiter" ? "/post-job" : "/jobs"
      );
    }
  }, [user]);
  const handleRoleSelection = async (userRole: string) => {
    await user
      ?.update({
        unsafeMetadata: {
          role: userRole,
        },
      })
      .then(() => {
        navigate(userRole === "recruiter" ? "/post-job" : "/jobs");
      })
      .catch((err) => console.log(err));
  };
  if (!isLoaded) {
    return (
      <BarLoader
        className="mb-4 w-full text-center"
        width={100}
        color="#36d7b7"
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <h2
        className="
    text-gray-300 font-extrabold text-7xl sm:text-8xl tracking-tighter"
      >
        I am a ...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          className="h-36 text-2xl"
          variant={"blue"}
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          onClick={() => handleRoleSelection("recruiter")}
          className="h-36 text-2xl"
          variant={"destructive"}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default OnBoardingPage;
