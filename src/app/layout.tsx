import React, {ReactNode} from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../components/globals.css";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next GConsole",
  description: "Mock Google Console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={inter.className}>
    {children}
    <Toaster/>
    </body>
    </html>
  );
}
