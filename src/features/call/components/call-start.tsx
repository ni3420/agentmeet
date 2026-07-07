"use client";

import React, { useEffect } from "react";
import { 
  SpeakerLayout, 
  CallControls, 
  StreamTheme, 
  useCallStateHooks, 
  CallingState 
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";

interface CallStartedProps {
  meetingName: string;
  onLeave: () => void;
}

const CallStarted = ({ meetingName, onLeave }: CallStartedProps) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
        <p className="text-sm font-medium text-neutral-400">Connecting video stream feeds...</p>
      </div>
    );
  }

  return (
    <StreamTheme>
      <div className="h-screen w-screen bg-neutral-950 flex flex-col justify-between p-4 relative select-none">
        <div className="absolute top-6 left-6 z-50 bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-xl backdrop-blur-md hidden sm:block">
          <p className="text-xs text-neutral-400 font-medium tracking-wide uppercase">Active Call</p>
          <h2 className="text-sm font-bold text-white tracking-tight">{meetingName}</h2>
        </div>

        <div className="flex-1 flex items-center justify-center relative w-full h-full overflow-hidden my-2">
          <SpeakerLayout participantsBarPosition="bottom" />
        </div>

        <div className="w-full flex justify-center py-2 z-50">
          <CallControls onLeave={onLeave} />
        </div>
      </div>
    </StreamTheme>
  );
};

export default CallStarted;