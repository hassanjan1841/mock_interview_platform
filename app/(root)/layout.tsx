import ProfileWithMenu from "@/components/ProfileWIthMenu";
import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");
  const user = await getCurrentUser();
  console.log(user);
  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between  shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <Image src={"/logo.svg"} alt="Logo" width={38} height={32} />
          <h2 className="text-2xl font-bold">PrepWise</h2>
        </Link>
        <ProfileWithMenu photoURL={user?.photoURL} />
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
