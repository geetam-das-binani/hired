import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import JobListingPage from "./pages/JobListingPage";
import MyJobsPage from "./pages/MyJobsPage";
import JobPage from "./pages/JobPage";
import PostJobsPage from "./pages/PostJobsPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import { ThemeProvider } from "@/components/theme-provider";
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: <OnBoardingPage />,
      },
      {
        path: "/jobs",
        element: <JobListingPage />,
      },
      {
        path: "/job/:id",
        element: <JobPage />,
      },
      {
        path: "/my-jobs",
        element: <MyJobsPage />,
      },
      {
        path: "/post-job",
        element: <PostJobsPage />,
      },
      {
        path: "/saved-job",
        element: <SavedJobsPage />,
      },
    ],
  },
]);
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
