import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetAgent = (agentId: string) => {
  return useQuery({
    queryKey: ["agent", agentId],
    queryFn: async () => {
      const res = await client.api.rpc.agents[":id"].$get({
        param: { id: agentId },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch agent details");
      }

      const { data } = await res.json();
      return data;
    },
    enabled: !!agentId,
  });
};