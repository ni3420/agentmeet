import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Request = InferRequestType<typeof client.api.rpc.agents.$post>;
type Response = InferResponseType<typeof client.api.rpc.agents.$post>;

export const useCreateAgents = () => {
  return useMutation<Response, Error, Request>({
    mutationFn: async (data) => {
      const res = await client.api.rpc.agents.$post({
        json:data
      });

      if (!res.ok) {
        throw new Error("Failed to create agent");
      }

      return await res.json();
    },
  });
};