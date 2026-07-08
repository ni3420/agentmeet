"use client";

import React, { useEffect } from "react";
import { 
  VideoPreview, 
  useCall,
  useCallStateHooks,
  DefaultVideoPlaceholder
} from "@stream-io/video-react-sdk";
import { LogIn, Mic, MicOff, Video, VideoOff, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client"; 
import Image from "next/image";
import "@stream-io/video-react-sdk/dist/css/styles.css";

interface CallLobbyProps {
  meetingName: string;
  onJoin: () => void;
  onCancel: () => void;
}

const CallLobby = ({ meetingName, onJoin, onCancel }: CallLobbyProps) => {
  const { data: session, isPending } = authClient.useSession();
  const call = useCall();
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  
  const { camera, isMute: isCamMuted } = useCameraState();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();

  useEffect(() => {
    if (!call) return;
    
    call.camera.enable().catch(console.error);
    call.microphone.enable().catch(console.error);
  }, [call]);

  if (isPending) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
        <p className="text-sm font-medium text-neutral-400">Loading profile configuration...</p>
      </div>
    );
  }

  const userParticipant = {
    id: session?.user?.id || "local-preview",
    name: session?.user?.name || "You",
    image: session?.user?.image || "",
    isLocalParticipant: true,
  };

  const CustomPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full bg-neutral-900 text-neutral-400 gap-3">
      {userParticipant.image ? (
        <Image
          src={userParticipant.image} 
          alt={userParticipant.name} 
          width={80}
          height={80}
          className="rounded-full border border-neutral-700 object-cover shadow-lg"
        />
      ) : (
        <DefaultVideoPlaceholder participant={userParticipant as any} />
      )}
      <p className="text-sm font-medium tracking-wide text-neutral-400">Your camera is turned off</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-6">
      <div className="w-full max-w-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
        
        <div className="text-center space-y-2">
          <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            Lobby Room
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-100 capitalize">
            {meetingName}
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Review your media controls, <span className="text-neutral-200 font-medium">{userParticipant.name}</span>, before stepping into the room.
          </p>
        </div>

        <div className="relative aspect-video w-full bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 shadow-inner flex items-center justify-center">
          <VideoPreview DisabledVideoPreview={CustomPlaceholder} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="bg-neutral-950/80 border border-neutral-800 px-6 py-3 rounded-full flex items-center gap-4 shadow-xl">
            <button
              type="button"
              onClick={() => camera.toggle()}
              className={`p-3 rounded-full border transition-all duration-200 ${
                !isCamMuted 
                  ? "bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800" 
                  : "bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20"
              }`}
            >
              {!isCamMuted ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </button>

            <div className="w-px h-6 bg-neutral-800" />

            <button
              type="button"
              onClick={() => microphone.toggle()}
              className={`p-3 rounded-full border transition-all duration-200 ${
                !isMicMuted 
                  ? "bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800" 
                  : "bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20"
              }`}
            >
              {!isMicMuted ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-800/60">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onJoin}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>Join Meeting</span>
            <LogIn className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CallLobby;