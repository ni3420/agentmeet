import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<typeof client.api.rpc.meeting[":id"]["$patch"]>["json"];
type ResponseType = InferResponseType<typeof client.api.rpc.meeting[":id"]["$patch"]>;

export const useUpdateMeeting = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.rpc.meeting[":id"].$patch({
        param: { id },
        json,
      });
      if (!res.ok) throw new Error("Failed to update meeting");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["meeting", id] });
    },
  });
};