"use client";

import React, { useState } from "react";
import { 
  SpeakerLayout, 
  useCallStateHooks 
} from "@stream-io/video-react-sdk";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Radio } from "lucide-react";

interface CallStartedProps {
  meetingName?: string;
  onLeave: () => void;
}

const CallStarted = ({ meetingName = "AI Meeting", onLeave }: CallStartedProps) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-white select-none overflow-hidden">
      
      <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/80 border-b border-neutral-800/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold tracking-tight text-neutral-200 capitalize">
            {meetingName}
          </h1>
          <div className="h-4 w-px bg-neutral-800" />
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            <Radio className="size-3.5 animate-pulse" />
            <span>Live Agent</span>
          </div>
        </div>
        <div className="text-xs font-mono text-neutral-400">
          State: <span className="text-emerald-400 capitalize">{callingState}</span>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full p-4 bg-neutral-950 flex items-center justify-center">
        <SpeakerLayout />
      </div>

      <div className="flex items-center justify-center p-6 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent absolute bottom-0 left-0 right-0 z-10">
        <div className="flex items-center gap-4 bg-neutral-900/90 border border-neutral-800/80 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-xl border transition-all duration-200 ${
              isMuted 
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20" 
                : "bg-neutral-800 border-neutral-700/60 text-neutral-200 hover:bg-neutral-700 hover:text-white"
            }`}
          >
            {isMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-xl border transition-all duration-200 ${
              isVideoOff 
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20" 
                : "bg-neutral-800 border-neutral-700/60 text-neutral-200 hover:bg-neutral-700 hover:text-white"
            }`}
          >
            {isVideoOff ? <VideoOff className="size-5" /> : <Video className="size-5" />}
          </button>

          <div className="w-px h-8 bg-neutral-800 mx-1" />

          <button
            type="button"
            onClick={onLeave}
            className="p-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-950/20 transition-all duration-200 flex items-center justify-center"
          >
            <PhoneOff className="size-5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default CallStarted;