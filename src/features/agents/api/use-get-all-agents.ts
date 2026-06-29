import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type Response = InferResponseType<typeof client.api.rpc.agents["$get"]>;

export const useGetAllAgents = () => {
  return useQuery<Response,Error>({
    queryKey: ["agents"],
    queryFn: async () => {
        console.log("stage 1")
      const res = await client.api.rpc.agents.$get()
      console.log(res,"stage 2")

      if (!res.ok) {
        console.log("stage 3")
        throw new Error("Failed to fetch agents");
      }
      console.log("stage 5")
      console.log(res)
      return res.json()
    },
  });
};