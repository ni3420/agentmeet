"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { StreamVideoClient } from "@stream-io/video-react-sdk";

interface CallLobbyProps {
  meetingId: string;
  meetingName: string;
}

export default function CallLobby({
  meetingId,
  meetingName,
}: CallLobbyProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    async function init() {
      const session = await authClient.getSession();

      // Fetch Stream token from your backen
      const videoClient = new StreamVideoClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
        user:session.data?.user.name,
        token:session.data?.session.token,
      });

      const call = videoClient.call("default", meetingId);
      await call.getOrCreate();

      setClient(videoClient);
    }

    init();
  }, [meetingId]);

  return <div>Call Lobby - {meetingName}</div>;
}