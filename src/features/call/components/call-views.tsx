import { useGetMeeting } from "@/features/meeting/api/use-get-meeting";
import CallProvider from "./call-provider";

interface CallUIProps{
    meetingId:string
}
const CallViews = ({meetingId}:CallUIProps) => {
    const {data}=useGetMeeting(meetingId)
    
    if(data?.data.status=="complete"){
        return <>meeting is ended</>
    }

    return ( <CallProvider meetingId={meetingId} meetingName={data?.data.name as string}/> );
}
 
export default CallViews