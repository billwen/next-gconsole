import Image from "next/image";
import {NavMenuBar} from "@/components/shared/NavMenuBar";
import {ds} from "@/services/data-service";

export default function Home() {
  console.log(`${Object.keys(ds).length}`);

  return (
    <>
      <NavMenuBar/>
      <main className="mt-[60px] bg-amber-50">
        Main content
      </main>
    </>
  );
}

export const runtime = 'nodejs';
