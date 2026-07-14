"use client";

import React, { useState, useEffect } from "react";
import { 
  StreamVideo, 
  StreamVideoClient, 
  StreamCall, 
  Call 
} from "@stream-io/video-react-sdk";
import { Loader2, AlertCircle } from "lucide-react";
import { useStreamVideo } from "../api/use-stream-video-call";
import CallLobby from "./call-lobby";
import CallStarted from "./call-start";
import CallEnded from "./call-ended";

interface CallUIProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  username: string;
  userImage?: string;
}

const CallUI = ({ 
  meetingId, 
  meetingName,
  userId,
  username,
  userImage
}: CallUIProps) => {
  const [viewState, setViewState] = useState<"lobby" | "active" | "ended">("lobby");
  const [clientInstance, setClientInstance] = useState<StreamVideoClient | null>(null);
  const [callInstance, setCallInstance] = useState<Call | null>(null);

  const { mutate: generateToken, isPending, error, data } = useStreamVideo();

  useEffect(() => {
    if (!meetingId) return;
    generateToken({ id: meetingId });
  }, [meetingId, generateToken]);

  useEffect(() => {
    if (!data?.apiKey || !data?.token || !userId) return;

    const videoClient = StreamVideoClient.getOrCreateInstance({
      apiKey: data.apiKey,
      user: {
        id: userId,
        name: username || data.userName,
        image: userImage || "",
      },
      token: data.token,
    });

    const videoCall = videoClient.call("default", meetingId);
    
    setClientInstance(videoClient);
    setCallInstance(videoCall);

    return () => {
      videoCall.leave().catch(console.error);
      videoClient.disconnectUser().catch(console.error);
      setCallInstance(null);
      setClientInstance(null);
    };
  }, [data, meetingId, userId, username, userImage]);

  const handleJoinCall = async () => {
    if (!callInstance) return;
    try {
      await callInstance.join({ create: true });
      setViewState("active");
    } catch (err) {
      console.error("Failed to complete room runtime connection:", err);
    }
  };

  const handleLeaveCall = async () => {
    if (!callInstance) return;
    try {
      await callInstance.leave();
      setViewState("ended");
    } catch (err) {
      console.error("Failed to cleanly terminate room channel:", err);
    }
  };

  const handleCancelLobby = () => {
    window.location.href = "/meetings";
  };

  if (isPending) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
        <p className="text-sm font-medium text-neutral-400">Requesting token authorizations...</p>
      </div>
    );
  }

  if (error || (!data && !isPending)) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white p-6 max-w-md mx-auto text-center gap-4">
        <AlertCircle className="size-12 text-rose-500 animate-pulse" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-neutral-200">Stream Connection Aborted</h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {error?.message || "Secure token exchange handshake rejected."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCancelLobby}
          className="px-5 py-2 text-sm font-medium bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 text-neutral-200 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!clientInstance || !callInstance) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
        <p className="text-sm font-medium text-neutral-400">Mounting video execution streams...</p>
      </div>
    );
  }

  return (
    <StreamVideo client={clientInstance}>
      <StreamCall call={callInstance}>
        <div className="h-screen w-screen bg-neutral-950 select-none overflow-hidden">
          {viewState === "lobby" && (
            <CallLobby 
              meetingName={meetingName} 
              onJoin={handleJoinCall} 
              onCancel={handleCancelLobby} 
            />
          )}

          {viewState === "active" && (
            <CallStarted 
             meetingId={meetingId}
              meetingName={meetingName} 
              onLeave={handleLeaveCall} 
            />
          )}

          {viewState === "ended" && (
            <CallEnded 
              meetingName={meetingName} 
            />
          )}
        </div>
      </StreamCall>
    </StreamVideo>
  );
};

export default CallUI;