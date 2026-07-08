"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  StreamVideoClient, 
  StreamVideo as StreamProvider, 
  StreamCall, 
  SpeakerLayout, 
  CallControls, 
  Call,
  User
} from "@stream-io/video-react-sdk";
import { client as rpcClient } from "@/lib/rpc";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface StreamVideoViewProps {
  roomId: string;
}

export default function StreamVideoView({ roomId }: StreamVideoViewProps) {
  const router = useRouter();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let localClient: StreamVideoClient | null = null;
    let localCall: Call | null = null;

    async function initStreamPlatform() {
      try {
        const res = await rpcClient.api.rpc.meeting[":id"].token.$post({
          param: { id: roomId },
        });

        if (!res.ok) {
          throw new Error("Failed to provision secure WebRTC signaling tokens");
        }

        const payload = await res.json();
        
        if (!isMounted) return;

        const userContext: User = {
          id: payload.userId,
          name: payload.userName || "Participant",
        };

        localClient = new StreamVideoClient({
          apiKey: payload.apiKey,
          user: userContext,
          token: payload.token,
        });

        localCall = localClient.call("default", roomId);
        await localCall.join({ create: true });

        if (isMounted) {
          setVideoClient(localClient);
          setActiveCall(localCall);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setErrorState(err instanceof Error ? err.message : "Internal signaling connection failure");
        }
      }
    }

    initStreamPlatform();

    return () => {
      isMounted = false;
      if (localCall) {
        localCall.leave().catch(console.error);
      }
      if (localClient) {
        localClient.disconnectUser().catch(console.error);
      }
    };
  }, [roomId]);

  if (errorState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 border border-destructive/20 rounded-2xl bg-destructive/5 text-center max-w-xl mx-auto select-none">
        <ShieldAlert className="size-10 text-destructive" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">Signaling Interrupted</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{errorState}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push("/interviews")}
          className="h-9 text-xs font-semibold"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (!videoClient || !activeCall) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center select-none">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-medium animate-pulse tracking-wide">
          Authorizing WebRTC tokens & allocating processing loops...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 select-none">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 sm:p-6 shadow-2xl overflow-hidden min-h-[650px] flex flex-col justify-between relative group">
        <StreamProvider client={videoClient}>
          <StreamCall call={activeCall}>
            <div className="flex-1 w-full h-full min-h-[500px] flex flex-col justify-between relative">
              <div className="absolute top-2 left-2 z-30">
                <div className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-md flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ENC_STREAM_ACTIVE
                </div>
              </div>
              
              <div className="flex-1 rounded-xl overflow-hidden border border-neutral-900 bg-neutral-900/40 relative">
                <SpeakerLayout participantsBarPosition="bottom" />
              </div>

              <div className="pt-4 flex items-center justify-center w-full z-20">
                <div className="bg-neutral-900/90 border border-neutral-800/80 p-2 rounded-xl shadow-xl backdrop-blur-md transition-opacity duration-300">
                  <CallControls onLeave={() => router.push("/interviews")} />
                </div>
              </div>
            </div>
          </StreamCall>
        </StreamProvider>
      </div>
    </div>
  );
}