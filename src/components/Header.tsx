import { Link, useSearchParams } from "react-router-dom";

import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import React, { useEffect, useState } from "react";
const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  function handleOverLayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (search.get("sign-in")) return;
    if (e.target === e.currentTarget) setShowSignIn(false);
    setSearch("");
  }
  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to={"/"}>
          <img src="/logo.png" alt="logo" className="h-20" />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button onClick={() => setShowSignIn(true)} variant={"outline"}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to={"/post-job"}>
                <Button className="rounded-full" variant={"destructive"}>
                  <PenBox size={20} className="mr-2" />
                  Post Job
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverLayClick}
        >
          <SignIn
            signUpForceRedirectUrl={
              search.get("redirect_uri")
                ? search.get("redirect_uri")
                : "/onboarding"
            }
            fallbackRedirectUrl={
              search.get("redirect_uri")
                ? search.get("redirect_uri")
                : "/onboarding"
            }
          />
        </div>
      )}
    </>
  );
};

export default Header;
