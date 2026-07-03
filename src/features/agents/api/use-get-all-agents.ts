import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type Response = InferResponseType<typeof client.api.rpc.agents["$get"]>;

export const useGetAllAgents = () => {
  return useQuery<Response,Error>({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await client.api.rpc.agents.$get()
      console.log(res)

      if (!res.ok) {
        throw new Error("Failed to fetch agents");
      }
      return res.json()
    },
  });
};