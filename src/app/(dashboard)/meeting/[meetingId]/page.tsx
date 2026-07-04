"use client";

import React from "react";
import { useParams } from "next/navigation";
import StreamVideoCall from "@/features/meeting/components/stream-video";

export default function MeetingRoomPage() {
  const params = useParams();
  const roomId = params.meetingId as string;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Live Meeting Room</h1>
        <p className="text-xs text-muted-foreground">Room ID: {roomId}</p>
      </div>

      {/* हमारा वीडियो कॉल कंपोनेंट यहाँ रेंडर होगा */}
      <StreamVideoCall roomId={roomId} />
    </div>
  );
}