import Image from "next/image";
import {NavMenuBar} from "@/components/shared/NavMenuBar";

export default function Home() {
  return (
    <>
      <NavMenuBar/>
      <main className="mt-[60px] bg-amber-50">
        Main content
      </main>
    </>
  );
}
