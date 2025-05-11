import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
   <div>
  <div className="grid-background"></div>
  <main className="min-h-screen max-w-screen-xl mx-auto px-4">
    <Header />
    <Outlet />
  </main>
  <div className="p-10 text-center bg-gray-800 mt-10 text-white">
    Made with 💗 by Geetam
  </div>
</div>

  );
};

export default AppLayout;
