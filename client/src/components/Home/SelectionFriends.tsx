import { FaUser } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useSelector } from "react-redux";
import { Friend, Request } from "../../slices/friendshipSlice";
import { useContext } from "react";
import ChatContext, { ChatContextType } from "../../context/ChatContext";


const SelectionFriends = () => {

    const friends = useSelector((state:any) => state.friendship.friends)
    const receivedRequests = useSelector((state:any) => state.friendship.receivedRequests)
    const sentRequests = useSelector((state:any) => state.friendship.sentRequests)

    const {chatting, updateChatting} = useContext(ChatContext) as ChatContextType

    return (
        <div className='h-full overflow-y-auto scrollbar-thin'>

            <Accordion defaultExpanded className="border border-black shadow-none">
                <AccordionSummary
                expandIcon={<MdExpandMore size={20}/>}
                aria-controls="friends-content"
                id="friends-header"
                >
                <Typography component="span">Friends</Typography>
                </AccordionSummary>
                <ul className="flex flex-col gap-1 p-2">

                    {friends.length === 0 && <p>None</p>}

                    {friends.map((friend:Friend) => (
                        <li key={friend.userId} className="w-full">

                            {friend.userId === chatting?.id ? (
                                <button 
                                    className="p-3 w-full border text-left bg-black text-white duration-200 flex gap-2 items-center rounded-lg" 
                                    onClick={() => updateChatting({type: 'friend', id: friend.userId})}>
                                    <FaUser size={20}/>
                                    {friend.username}
                                </button>
                            ) : (
                                <button 
                                className="p-3 w-full border text-left hover:bg-black hover:text-white duration-200 flex gap-2 items-center rounded-lg" 
                                onClick={() => updateChatting({type: 'friend', id: friend.userId})}>
                                    <FaUser size={20}/>
                                    {friend.username}
                                </button>
                            )}

                        </li>
                    ))}
                </ul>
            </Accordion>

            <Accordion className="border border-black shadow-none">
                <AccordionSummary
                expandIcon={<MdExpandMore size={20}/>}
                aria-controls="received-requests-content"
                id="received-requests-header"
                >
                <Typography component="span">Received requests</Typography>
                </AccordionSummary>
                <ul className="flex flex-col gap-1 p-2">

                    {receivedRequests.length === 0 && <p>None</p>}

                    {receivedRequests.map((request:Request) => (
                        <li key={request.friendshipId} className="w-full">
                            <button className="p-3 w-full border text-left hover:bg-black hover:text-white duration-200 flex gap-2 items-center rounded-lg">
                                <FaUser size={20}/>
                                {request.from_username}
                            </button>
                        </li>
                    ))}
                </ul>
            </Accordion>

            <Accordion className="border border-black shadow-none">
                <AccordionSummary
                expandIcon={<MdExpandMore size={20}/>}
                aria-controls="sent-requests-content"
                id="sent-requests-header"
                >
                <Typography component="span">Sent requests</Typography>
                </AccordionSummary>
                <ul className="flex flex-col gap-1 p-2">

                    {sentRequests.length === 0 && <p>None</p>}

                    {sentRequests.map((request:Request) => (
                        <li key={request.friendshipId} className="w-full">
                            <button className="p-3 w-full border text-left hover:bg-black hover:text-white duration-200 flex gap-2 items-center rounded-lg">
                                <FaUser size={20}/>
                                {request.to_username}
                            </button>
                        </li>
                    ))}
                </ul>
            </Accordion>

        </div>
    )
}

export default SelectionFriends