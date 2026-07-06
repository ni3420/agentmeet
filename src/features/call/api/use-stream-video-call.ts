import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface TokenResponse {
  status: number;
  token: string;
  apiKey: string;
  userId: string;
  userName: string;
  error?: string;
}

export const useStreamVideo = (meetingId: string) => {
  return useQuery<TokenResponse, Error>({
    queryKey: ["meetings", meetingId, "token"],
    queryFn: async () => {
      try {
        const res = await client.api.rpc.meeting[":id"]["token"].$post({
          param: { id: meetingId },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch stream token configuration");
        }

        const data = await res.json();
        return data as TokenResponse;
      } catch (error: any) {
        throw new Error(error.message || "Failed to fetch stream token configuration");
      }
    },
    enabled: !!meetingId,
    staleTime: 5 * 60 * 1000,
  });
};