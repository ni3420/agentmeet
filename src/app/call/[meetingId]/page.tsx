"use client"
import CallViews from "@/features/call/components/call-views";
import { useParams } from "next/navigation";


const Page = () => {
    const params=useParams()
    const Id=params.meetingId as string
    return ( <>
    <CallViews meetingId={Id}/>
    </> );
}
 
export default Page;