import DashBoardSideBar from "@/features/dashboard/components/dashboard-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  // 1. If not authenticated, force them to login page
  if (!session?.session) {
    redirect("/sign-in");
  }

  // 2. If authenticated, do NOT redirect to "/". Let the page render below safely.
  return (
    <>
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-y-2">
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Dashboard Workspace Matrix
      </h1>
      <p className="text-sm text-muted-foreground">
        Authenticated successfully as {session.user?.email}
      </p>
    </div></>
    
  );
}