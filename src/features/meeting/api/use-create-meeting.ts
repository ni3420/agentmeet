import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<typeof client.api.rpc.meeting.$post>
type ResponseType = InferResponseType<typeof client.api.rpc.meeting.$post>;

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.rpc.meeting.$post( json );
      

      if (!res.ok) {
        throw new Error("Failed to initialize structural meeting profile context");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
};