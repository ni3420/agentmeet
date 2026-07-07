"use client";

import React from "react";
import { 
  VideoPreview, 
  ToggleAudioPreviewButton, 
  ToggleVideoPreviewButton,
  DefaultVideoPlaceholder
} from "@stream-io/video-react-sdk";
import { LogIn, XCircle } from "lucide-react";

interface CallLobbyProps {
  meetingName: string;
  onJoin: () => void;
  onCancel: () => void;
}

const CallLobby = ({ meetingName, onJoin, onCancel }: CallLobbyProps) => {
  const dummyParticipant = {
    id: "local-preview",
    name: "You",
    image: "",
    isLocalParticipant: true,
  };

  const CustomPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full bg-neutral-900 text-neutral-400">
      <DefaultVideoPlaceholder participant={dummyParticipant as any} />
      <p className="text-sm mt-2 font-mono">Camera is turned off</p>
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
            Configure your setup before joining the live session.
          </p>
        </div>

        <div className="relative aspect-video w-full bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 shadow-inner flex items-center justify-center">
          <VideoPreview DisabledVideoPreview={CustomPlaceholder} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="bg-neutral-950/80 border border-neutral-800 px-4 py-2 rounded-full flex items-center gap-3 shadow-lg">
            <ToggleAudioPreviewButton />
            <div className="w-px h-6 bg-neutral-800" />
            <ToggleVideoPreviewButton />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-800/60">
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