"use client";

import React from "react";
import { PhoneOff, Home, ArrowLeft } from "lucide-react";

interface CallEndedProps {
  meetingName: string;
}

const CallEnded = ({ meetingName }: CallEndedProps) => {
  const handleRedirect = () => {
    window.location.href = "/meetings";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-6">
      <div className="w-full max-w-md bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md rounded-2xl p-6 md:p-8 text-center space-y-6 shadow-2xl">
        
        <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-950/20">
          <PhoneOff className="size-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-100">
            You left the meeting
          </h1>
          <p className="text-sm text-neutral-400 max-w-xs mx-auto leading-relaxed">
            The session connection parameters for <span className="text-neutral-300 font-medium capitalize">"{meetingName}"</span> have been safely disconnected.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleRedirect}
            className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <Home className="size-4 text-neutral-400" />
            <span>Return to Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CallEnded;