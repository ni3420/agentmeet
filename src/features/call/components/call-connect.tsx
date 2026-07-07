"use client";

import React, { useEffect, useState } from "react";
import { useStreamVideo } from "../api/use-stream-video-call";
import { StreamVideoClient, Call, SpeakerLayout,   StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import { Loader2, AlertCircle } from "lucide-react";
import "@/app/index.css"
import CallUI from "./call-ui";


interface CallConnectProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  username: string;
  userImage: string;
}

const CallConnect = ({
  meetingId,
  userId,
  userImage,
  username,
}: CallConnectProps) => {
  const { mutate: generateToken, isPending, error, data } = useStreamVideo();
  const [clientInstance, setClientInstance] = useState<StreamVideoClient | null>(null);
  const [callInstance, setCallInstance] = useState<Call | null>(null);

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
        image: userImage,
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

  if (isPending) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
        <p className="text-sm font-medium text-neutral-400">
          Requesting call authorization tokens...
        </p>
      </div>
    );
  }

  if (error || (!data && !isPending)) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white p-6 max-w-md mx-auto text-center gap-4">
        <AlertCircle className="size-12 text-rose-500 animate-pulse" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-neutral-200">
            Stream Verification Rejected
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {error?.message || "Secure credentials could not be provisioned."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => (window.location.href = "/meetings")}
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
        <p className="text-sm font-medium text-neutral-400">
          Mounting real-time video layers...
        </p>
      </div>
    );
  }

  return (
      <StreamVideo client={clientInstance}>
      <StreamCall call={callInstance}>
        <CallUI/>
      </StreamCall>
    </StreamVideo>
  );
};

export default CallConnect;