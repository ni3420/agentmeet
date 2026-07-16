"use client"
import CallView from "@/features/call/components/call-view";
import { useGetMeeting } from "@/features/meeting/api/use-get-meeting";
import { useParams } from "next/navigation";


const Page = () => {
    const params=useParams()
    const Id=params.meetingId as string
    const {data}=useGetMeeting(Id)
    return ( <>
    call Id
    {JSON.stringify(data)}
    <CallView meetingId={Id} meetingName={data?.name || "check"}/>
    </> );

}
 
export default Page;