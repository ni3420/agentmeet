import CallLobby from "./call-lobby";

interface CallViewProps{
    meetingId:string
    meetingName:string
}

const CallView = ({meetingId,meetingName}:CallViewProps) => {
    return (  <>
    Call views
    {meetingName}
    <CallLobby meetingId={meetingId} meetingName={meetingName}/>
    
    </>);
}
 
export default CallView;