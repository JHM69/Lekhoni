"use client";
import { usePathname } from "next/navigation"; // Use usePathname instead
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar"; 
import { TrpcProvider } from "@/utils/trpc-provider";
import { useSession } from "next-auth/react";

  

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname(); // Get the current pathname
  const isPreviewRoute = pathname?.includes("preview") && !session;

  return (
    <>
      <TrpcProvider>
        <Header />
        <div className="flex h-screen overflow-hidden">
          {!isPreviewRoute && <Sidebar />}
          <main className="w-full pt-16">{children}</main>
        </div>
      </TrpcProvider>
    </>
  );
}
