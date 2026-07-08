"use client";

import React, { useEffect, useState } from "react";
import { 
  SpeakerLayout, 
  CallControls, 
  StreamTheme, 
  useCallStateHooks, 
  CallingState,
  useCall
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Loader2, Users, Sparkles, Home } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface CallStartedProps {
  meetingId: string;
  meetingName: string;
  onLeave: () => void;
}

const CallStarted = ({ meetingId, meetingName, onLeave }: CallStartedProps) => {
  const call = useCall();
  const { useCallCallingState, useParticipantCount, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const participants = useParticipants();
  
  const [agentStatus, setAgentStatus] = useState<"idle" | "connecting" | "active" | "failed">("idle");

  useEffect(() => {
    if (callingState !== CallingState.JOINED || !meetingId || agentStatus !== "idle") return;

    const triggerGeminiAgent = async () => {
      setAgentStatus("connecting");
      try {
        await axios.post(`/api/meetings/${meetingId}/agent`);
        setAgentStatus("active");
      } catch (err) {
        console.error("Failed to connect Gemini Live Worker:", err);
        setAgentStatus("failed");
      }
    };

    triggerGeminiAgent();
  }, [callingState, meetingId, agentStatus]);

  const isGeminiInRoom = participants.some(p => p.userId.includes("gemini-agent"));

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
      <div className="h-screen w-screen bg-neutral-950 flex flex-col justify-between p-4 relative select-none overflow-hidden">
        
        <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800/80 px-4 py-2 rounded-xl flex items-center gap-3 pointer-events-auto shadow-xl">
              <Link href="/meeting" className="text-neutral-400 hover:text-white transition-colors mr-1">
                <Home className="size-4" />
              </Link>
              <div className="w-px h-4 bg-neutral-800" />
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase leading-none">Live Session</p>
                <h2 className="text-sm font-bold text-neutral-100 tracking-tight capitalize mt-0.5">{meetingName}</h2>
              </div>
            </div>

            <div className={`backdrop-blur-md border px-4 py-2 rounded-xl flex items-center gap-2 pointer-events-auto shadow-xl transition-all duration-300 ${
              isGeminiInRoom 
                ? "bg-purple-950/40 border-purple-500/30 text-purple-300" 
                : "bg-neutral-900/70 border-neutral-800/80 text-neutral-400"
            }`}>
              <Sparkles className={`size-4 ${isGeminiInRoom ? "animate-pulse text-purple-400" : ""}`} />
              <div className="text-left">
                <p className="text-[9px] font-bold tracking-wider uppercase leading-none text-neutral-400">Gemini Live</p>
                <p className="text-xs font-semibold mt-0.5">
                  {isGeminiInRoom ? "Agent Connected" : "Agent Offline"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800/80 px-3 py-2 rounded-xl flex items-center gap-2 pointer-events-auto shadow-xl">
            <Users className="size-4 text-emerald-400" />
            <span className="text-xs font-semibold font-mono text-neutral-200">
              {participantCount} {participantCount === 1 ? "User" : "Users"}
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center relative w-full h-full overflow-hidden rounded-2xl bg-neutral-900/30 border border-neutral-900/60 mt-16 mb-2">
          <SpeakerLayout participantsBarPosition="bottom" />
        </div>

        <div className="w-full flex justify-center py-2 z-50 transform hover:scale-[1.01] transition-transform duration-200">
          <div className="bg-neutral-900/80 backdrop-blur-lg px-4 rounded-2xl border border-neutral-800/80 shadow-2xl shadow-black/80 video-control-wrapper">
            <CallControls onLeave={onLeave} />
          </div>
        </div>

      </div>
    </StreamTheme>
  );
};

export default CallStarted;