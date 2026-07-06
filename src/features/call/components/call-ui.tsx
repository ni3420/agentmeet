"use client";

import React, { useState, useEffect } from "react";
import { 
  StreamVideo, 
  StreamVideoClient, 
  StreamCall, 
  Call 
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import CallLobby from "./call-lobby";
import CallStarted from "./call-started";
import CallEnded from "./call-ended";

interface CallUIProps {
  meetingId: string;
  meetingName: string;
  token: string;
  apiKey: string;
  userId: string;
  userName: string;
}

const CallUI = ({ 
  meetingId, 
  meetingName, 
  token, 
  apiKey, 
  userId, 
  userName 
}: CallUIProps) => {
  const [viewState, setViewState] = useState<"lobby" | "active" | "ended">("lobby");
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    if (!apiKey || !userId || !token) return;

    const videoClient = new StreamVideoClient({
      apiKey,
      user: { id: userId, name: userName },
      token,
    });

    const videoCall = videoClient.call("default", meetingId);
    
    setClient(videoClient);
    setCall(videoCall);

    return () => {
      videoCall.leave().catch(console.error);
      videoClient.disconnectUser().catch(console.error);
      setCall(null);
      setClient(null);
    };
  }, [meetingId, token, apiKey, userId, userName]);

  const handleJoinCall = async () => {
    if (!call) return;
    try {
      await call.join();
      setViewState("active");
    } catch (error) {
      console.error("Failed to join call:", error);
    }
  };

  const handleLeaveCall = async () => {
    if (!call) return;
    try {
      await call.leave();
      setViewState("ended");
    } catch (error) {
      console.error("Failed to safely leave call:", error);
    }
  };

  const handleCancelLobby = () => {
    window.location.href = "/meetings";
  };

  if (!client || !call) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-emerald-500" />
          <p className="text-sm font-medium text-neutral-400">Initializing secure stream connection...</p>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
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