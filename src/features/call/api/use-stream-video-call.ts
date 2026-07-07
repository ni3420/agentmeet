import { client } from "@/lib/rpc"
import { useMutation } from "@tanstack/react-query"
import {InferResponseType} from "hono"

type ResponseType=InferResponseType<typeof client.api.rpc.meeting[":id"]["token"]["$post"],200>
type  RequestType={
  id:string,
}
export const useStreamVideo=()=>{
  return useMutation<ResponseType,Error,RequestType>({
    mutationFn:async(json)=>{
      const res=await client.api.rpc.meeting[":id"]["token"]["$post"]({
        param:json
      })
      if (!res.ok) {
        const error = await res.json();
        throw new Error("data is not found");
      }
       
      return await res.json()
    }

  })

}