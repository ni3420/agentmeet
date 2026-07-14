"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  CallControls, 
  StreamTheme, 
  useCallStateHooks, 
  CallingState,
  ParticipantView
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Loader2, Users, Sparkles, Home, Bot, VideoOff } from "lucide-react";
import Link from "next/link";
import { useGemini } from "../api/use-gemini";
import { startPCMCapture } from "../hook/audio-capture";
import { gemini } from "../hook/Gemini";

interface CallStartedProps {
  meetingId: string;
  meetingName: string;
  onLeave: () => void;
}

const CallStarted = ({ meetingId, meetingName, onLeave }: CallStartedProps) => {
  const { useCallCallingState, useParticipantCount, useParticipants,useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const participants = useParticipants();
  const {mediaStream}=useMicrophoneState()
  

  const { mutate: triggerGemini, isPending: isAiLoading } = useGemini();
  const [hasTriggeredAgent, setHasTriggeredAgent] = useState(false);

  const { localParticipant, geminiParticipant, isGeminiInRoom } = useMemo(() => {
    const local = participants.find((p) => p.isLocalParticipant);
    
    const gemini = participants.find((p) => {
      const uId = p.userId?.toLowerCase() ?? "";
      const uName = p.name?.toLowerCase() ?? "";
      return uId.includes("ai-agent") || uId.includes("gemini") || uName.includes("gemini");
    });

    return {
      localParticipant: local,
      geminiParticipant: gemini,
      isGeminiInRoom: !!gemini,
    };
  }, [participants]);

  useEffect(() => {
    if (callingState !== CallingState.JOINED || !meetingId || hasTriggeredAgent) return;



    setHasTriggeredAgent(true);
    triggerGemini({id: meetingId });
    const stream=mediaStream;
    if(!stream) return

    let recorder: Awaited<ReturnType<typeof startPCMCapture>>;

  (async () => {
    recorder = await startPCMCapture(stream, (pcm) => {
gemini.sendPCM(pcm)
      // Gemini ko bhejo
      // gemini.sendPCM(pcm);
    });
  })();

  return () => {
    recorder?.stop();
  };
  }, [callingState, meetingId, hasTriggeredAgent, triggerGemini,mediaStream]);

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white gap-3 select-none">
        <Loader2 className="size-8 animate-spin text-purple-500" />
        <p className="text-sm font-medium text-neutral-400 animate-pulse">Connecting video stream feeds...</p>
      </div>
    );
  }

  return (
    <StreamTheme>
      <div className="h-screen w-screen bg-neutral-950 flex flex-col justify-between p-4 relative select-none overflow-hidden text-white">
        
        {/* Top Header Controls Area */}
        <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800/80 px-4 py-2 rounded-xl flex items-center gap-3 pointer-events-auto shadow-xl">
              <Link href="/meeting" className="text-neutral-400 hover:text-white transition-colors mr-1">
                <Home className="size-4" />
              </Link>
              <div className="w-px h-4 bg-neutral-800" />
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase leading-none">Live Session</p>
                <h2 className="text-sm font-bold text-neutral-100 tracking-tight capitalize mt-0.5">{meetingName}</h2>
              </div>
            </div>

            {/* Dynamic AI Status Badge */}
            <div className={`backdrop-blur-md border px-4 py-2 rounded-xl flex items-center gap-2 pointer-events-auto shadow-xl transition-all duration-300 ${
              isGeminiInRoom 
                ? "bg-purple-950/40 border-purple-500/30 text-purple-300" 
                : "bg-neutral-900/70 border-neutral-800/80 text-neutral-400"
            }`}>
              {isAiLoading ? (
                <Loader2 className="size-4 animate-spin text-purple-400" />
              ) : (
                <Sparkles className={`size-4 ${isGeminiInRoom ? "animate-pulse text-purple-400" : ""}`} />
              )}
              <div className="text-left">
                <p className="text-[9px] font-bold tracking-wider uppercase leading-none text-neutral-400">Gemini Live</p>
                <p className="text-xs font-semibold mt-0.5">
                  {isGeminiInRoom ? "Agent Connected" : isAiLoading ? "Spawning Agent..." : "Agent Offline"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800/80 px-3 py-2 rounded-xl flex items-center gap-2 pointer-events-auto shadow-xl">
            <Users className="size-4 text-purple-400" />
            <span className="text-xs font-semibold font-mono text-neutral-200">
              {participantCount} {participantCount === 1 ? "User" : "Users"}
            </span>
          </div>
        </div>

        {/* Dynamic Video Grid Matrix Container */}
        <div className="flex-1 flex items-center justify-center relative w-full h-full overflow-hidden rounded-2xl bg-neutral-900/10 border border-neutral-900/40 mt-16 mb-2 p-4">
          
          {isGeminiInRoom ? (
            /* 👥 Cinema Style 50/50 Split Grid View Layout Mode */
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              
              {/* Human View Grid Cell */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden relative shadow-2xl">
                {localParticipant && (
                  <ParticipantView 
                    participant={localParticipant} 
                    className="w-full h-full object-cover scale-x-[-1]" 
                  />
                )}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-neutral-950/85 border border-neutral-800/60 text-xs font-semibold text-neutral-200 backdrop-blur-md flex items-center gap-2">
                  <span>{localParticipant?.name || "Participant"}</span>
                  <span className="text-[9px] font-mono bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-bold uppercase">You</span>
                </div>
              </div>

              {/* Custom Animated Gemini AI View Grid Cell */}
              <div className="rounded-2xl border border-purple-500/20 bg-neutral-950 overflow-hidden relative shadow-2xl shadow-purple-500/5 flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05),transparent_65%)] animate-pulse" />
                
                <div className="p-5 rounded-full bg-purple-500/10 border border-purple-500/20 relative z-10">
                  <Bot className="size-10 text-purple-400 animate-bounce" style={{ animationDuration: '3.5s' }} />
                </div>
                
                <div className="mt-4 flex flex-col items-center gap-y-1 relative z-10">
                  <span className="text-xs font-semibold text-neutral-300 tracking-wide uppercase">Gemini AI Agent</span>
                  <p className="text-[10px] font-mono text-purple-400 animate-pulse">PRC_NODE_TRANSMITTING</p>
                </div>

                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-neutral-950/85 border border-neutral-800/60 text-xs font-semibold text-neutral-200 backdrop-blur-md flex items-center gap-2">
                  <span>{geminiParticipant?.name || "Gemini AI Node"}</span>
                  <span className="text-[9px] font-mono bg-purple-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">Agent</span>
                </div>
              </div>

            </div>
          ) : (
            /* 👤 Standby Mode View: Show Local View Fullscreen while AI wakes up */
            <div className="w-full h-full rounded-2xl border border-neutral-800 bg-neutral-900/40 relative overflow-hidden flex items-center justify-center">
              {localParticipant ? (
                <ParticipantView 
                  participant={localParticipant} 
                  className="w-full h-full object-cover scale-x-[-1]" 
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-500 text-xs">
                  <VideoOff className="size-6" /> Camera Feeds Deactivated
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-neutral-950/85 border border-neutral-800/60 text-xs font-semibold text-neutral-200 backdrop-blur-md">
                Awaiting agent proxy cluster bindings...
              </div>
            </div>
          )}
        </div>

        {/* Action Bottom Control Center Dock Panel */}
        <div className="w-full flex justify-center py-2 z-50">
          <div className="bg-neutral-900/80 backdrop-blur-lg px-4 rounded-2xl border border-neutral-800/80 shadow-2xl shadow-black/80">
            <CallControls onLeave={onLeave} />
          </div>
        </div>

      </div>
    </StreamTheme>
  );
};

export default CallStarted;