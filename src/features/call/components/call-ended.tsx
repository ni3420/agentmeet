"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, LayoutDashboard, Loader2 } from "lucide-react";

interface CallEndedProps {
  meetingName?: string;
}

const CallEnded = ({ meetingName = "AI Meeting" }: CallEndedProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-6">
      <div className="w-full max-w-md bg-neutral-900/60 border border-neutral-800 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <CheckCircle2 className="size-16 text-emerald-500 relative z-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
            Meeting Ended
          </h1>
          <p className="text-sm text-neutral-400 max-w-xs mx-auto capitalize">
            The session for {meetingName} has been successfully closed.
          </p>
        </div>

        <div className="w-full bg-neutral-950/50 border border-neutral-800/80 rounded-xl p-4 flex items-start gap-3 text-left">
          <Loader2 className="size-5 text-emerald-400 shrink-0 animate-spin mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>AI Processing Active</span>
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our AI Agent is currently generating your meeting notes, transcript, and summary. It will be available on your dashboard within a few minutes.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2 border-t border-neutral-800/60">
          <button
            type="button"
            onClick={() => router.push("/meetings")}
            className="w-full px-4 py-2.5 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl border border-neutral-700/50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FileText className="size-4" />
            <span>My Meetings</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full px-4 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-900/10 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="size-4" />
            <span>Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CallEnded;