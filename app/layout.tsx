/* eslint-disable import/no-unresolved */
import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/main-nav";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { Noto_Sans_Bengali, Galada } from "next/font/google";
import "./globals.css";
 
import { getServerSession } from "next-auth";
import ChatPopup from "@/components/layout/chat_popup";
import ThemeLayout from "@/components/layout/theme-layout";

const notoSansBengali = Noto_Sans_Bengali({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali"],
  variable: "--font-noto-bengali",
});

const galada = Galada({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-galada",
});

export const metadata: Metadata = {
  title: "লেখনী",
  description: "বাংলা লিখি বাংলায়",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${notoSansBengali.variable} ${galada.variable}`}>
        <Providers session={session}>
          <Toaster />
          <Header />
          <ThemeLayout>{children}</ThemeLayout>
          
          <ChatPopup />
        </Providers>
      </body>
    </html>
  );
}
