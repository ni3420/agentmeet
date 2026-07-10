import { client as rpcClient } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface GeminiMutationPayload {
  meetingId: string;
}

interface GeminiMutationResponse {
  status: number;
  message: string;
  data: {
    id: string;
    userId: string;
    name: string;
    agentId: string;
    instructions: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const useGemini = () => {
  const queryClient = useQueryClient();

  return useMutation<GeminiMutationResponse, Error, GeminiMutationPayload>({
    mutationFn: async ({ meetingId }) => {
      // FIXED: Hono RPC Dynamic Param Passing Syntax with .$post() execution
      const response = await rpcClient.api.rpc.meeting[":meetingId"]["agent"].$post({
        param: { meetingId },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "AI Gate closed" }));
        throw new Error((errorData as any).error || "Network error over RPC cluster");
      }

      // FIXED: Resolved RPC stream payload cleanly using .json() instead of axios .data
      return (await response.json()) as GeminiMutationResponse;
    },
    onSuccess: (_, variables) => {
      toast.success("AI Agent cluster successfully provisioned.");
      queryClient.invalidateQueries({ queryKey: ["meeting", variables.meetingId] });
    },
    onError: (error) => {
      console.error("AI Bridge Node Error:", error);
      toast.error(error instanceof Error ? error.message : "AI Gateway Failure");
    },
  });
};