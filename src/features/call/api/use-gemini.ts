import { client } from "@/lib/rpc";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  typeof client.api.rpc.call[":callType"][":callId"]["connect"]["$post"]
>;

interface RequestType {
  id: string;
}

export const useGemini = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ id }) => {
      const res =
        await client.api.rpc.call[":callType"][":callId"]["connect"]["$post"]({
          param: {
            callId: id,
            callType: "default",
          },
        });

      if (!res.ok) {
        throw new Error("Failed to connect Gemini");
      }

      const data = await res.json();

      const videoClient = new StreamVideoClient({
        apiKey: data.apiKey,
        user: data.user,
        token: data.token,
      });

      const call = videoClient.call(data.callType, data.callId);

      await call.join()
      call.microphone.enable()
      call.camera.enable()

      console.log("Gemini AI Bot joined!");


      return data;
    },
  });
};