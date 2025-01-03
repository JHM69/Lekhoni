/* eslint-disable import/no-unresolved */
import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
 
const inter = Inter({ subsets: ["latin"] });
 
export const metadata: Metadata = {
  title: "লেখনী",
  description: "বাংলা লিখি বাংলায়",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="bn" suppressHydrationWarning>
      
      <body className={`${inter.className}`}>
        <Providers session={session}>
          <Toaster />
          
          {children}
           
        </Providers>
      </body>
      
    </html>
  );
}
