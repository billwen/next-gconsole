"use client";

import {Button} from "@/components/ui/button";
import {useRouter} from 'next/navigation';

export const NavMenuBar = () => {

  const router = useRouter();
  const onClickLogin = () => {
    router.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full h-[60px] p-4 flex justify-between items-center bg-white border ">
      <div>
        <p className="font-bold text-xl text-blue-600">Console</p>
      </div>
      <div>
        <Button onClick={onClickLogin}>Login</Button>
      </div>
    </nav>
  );
};