import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetMeeting = (id?: string) => {
  return useQuery({
    queryKey: ["meeting", id],
    queryFn: async () => {
      if (!id) throw new Error("ID required");
      const res = await client.api.rpc.meeting[":id"].$get({ param: { id } });
      if (!res.ok) throw new Error("Failed to fetch meeting");
      return await res.json();
    },
    enabled: !!id,
  });
};