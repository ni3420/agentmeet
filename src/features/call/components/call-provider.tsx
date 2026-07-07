"use client"

import { authClient } from "@/lib/auth-client";
import CallConnect from "./call-connect";

interface CallProviderProps{
    meetingId:string,
    meetingName:string
}
const CallProvider = ({meetingId,meetingName}:CallProviderProps) => {
    const {data,isPending}=authClient.useSession()
    if(!data)
    {
        return <>Loading</>
    }
    return ( <CallConnect 
        meetingId={meetingId as string}
        meetingName={meetingName}
        userId={data?.user.id}
        username={data?.user.name}
        userImage={data?.user.image || ""} 
        /> );
}
 
export default CallProvider;