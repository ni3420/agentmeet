import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetMeetings = () => {
  return useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      const res = await client.api.rpc.meeting.$get();
      if (!res.ok) throw new Error("Failed to fetch meetings");
      return await res.json();
    },
  });
};