import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/provider/Query-client-provider";
import SideBar from "@/features/dashboard/components/dashboard-sidebar";
import NavBar from "@/features/dashboard/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentMeet - AI Collaboration Suite",
  description: "Automated meeting orchestration powered by autonomous AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-screen w-screen overflow-hidden antialiased`}
    >
      <body className="h-full w-full bg-background text-foreground flex flex-row overflow-hidden">
        <Providers>
          <SideBar />
          
          <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
            <NavBar />
            
            <main className="flex-1 w-full overflow-y-auto bg-background relative">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}