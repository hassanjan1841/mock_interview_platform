"use client";

import { handleLogout } from "@/lib/actions/auth.action";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";

const ProfileWithMenu = ({ photoURL }: User) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-row justify-end gap-4 relative" ref={menuRef}>
      <div>
        <Image
          src={photoURL || "/profile.svg"}
          alt="Profile Photo"
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        />
        {showMenu && (
          <div className="absolute right-0 top-12  shadow-lg rounded-lg p-4 z-10">
            <Button className="hover:cursor-pointer" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileWithMenu;
