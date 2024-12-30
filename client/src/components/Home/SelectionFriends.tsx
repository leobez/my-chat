import { FaUser } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useSelector } from "react-redux";
import { Friend, Request } from "../../slices/friendshipSlice";
import { useContext, useEffect } from "react";
import ChatContext, { ChatContextType } from "../../context/ChatContext";
import { RiChatDeleteFill } from "react-icons/ri";
import { useDeleteFriendship } from "../../hooks/friendshipHooks/useDeleteFriendship";
import { TiDeleteOutline } from "react-icons/ti";
import { IoPersonAddOutline } from "react-icons/io5";
import { useAcceptFriendRequest } from "../../hooks/friendshipHooks/useAcceptFriendRequest";
import { useDenyFriendRequest } from "../../hooks/friendshipHooks/useDenyFriendRequest";

const SelectionFriends = () => {

    const friends = useSelector((state:any) => state.friendship.friends)
    const receivedRequests = useSelector((state:any) => state.friendship.receivedRequests)
    const sentRequests = useSelector((state:any) => state.friendship.sentRequests)

    useEffect(() => {
        console.log('friends: ', friends)
    }, [friends])

    const {chatting, updateChatting} = useContext(ChatContext) as ChatContextType

    const {deleteFriendship} = useDeleteFriendship()
    const {acceptFriendRequest} = useAcceptFriendRequest()
    const {denyFriendRequest} = useDenyFriendRequest()

    const handleRemoval = (friendshipId:number) => {
        deleteFriendship(friendshipId)
    }

    const handleAccept = (friendshipId:number) => {
        acceptFriendRequest(friendshipId)
    }

    const handleDenial = (friendshipId:number) => {
        denyFriendRequest(friendshipId)
    }

    return (
        <div className='h-full scrollbar-thin relative z-0'>

            <Accordion defaultExpanded disableGutters className="border-2 my-1 border-black shadow-none">
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
                                    className="p-3 w-full border text-left bg-black text-white duration-300 flex gap-2 items-center rounded-lg justify-between" 
                                    onClick={() => updateChatting({type: 'friend', id: friend.userId})}>
                                    <div className="flex gap-3">
                                        <FaUser size={20}/>
                                        <p>{friend.username}</p>
                                        <p className="text-sm grid place-items-center"># {friend.userId}</p>
                                    </div>
                                    <div>
                                        {
                                            friend.online ? (
                                                <div className="h-4 w-4 rounded-full border-2 border-green-600 p-[2px]">
                                                    <div className="h-full w-full rounded-full bg-green-600"/>
                                                </div>
                                            ) : (
                                                <div className="h-4 w-4 rounded-full border-2 border-red-600 p-[2px]">
                                                    <div className="h-full w-full rounded-full bg-red-600"/>
                                                </div>
                                            )
                                        }
                                    </div>
                                </button>
                            ) : (
                                <button 
                                className="p-3 w-full border text-left hover:bg-black hover:text-white duration-300 flex gap-2 items-center rounded-lg justify-between" 
                                onClick={() => updateChatting({type: 'friend', id: friend.userId})}>
                                    <div className="flex gap-3">
                                        <FaUser size={20}/>
                                        <p>{friend.username}</p>
                                        <p className="text-sm grid place-items-center"># {friend.userId}</p>
                                    </div>
                                    <div>
                                        {
                                            friend.online ? (
                                                <div className="h-4 w-4 rounded-full border-2 border-green-600 p-[2px]">
                                                    <div className="h-full w-full rounded-full bg-green-600"/>
                                                </div>
                                            ) : (
                                                <div className="h-4 w-4 rounded-full border-2 border-red-600 p-[2px]">
                                                    <div className="h-full w-full rounded-full bg-red-600"/>
                                                </div>
                                            )
                                        }
                                    </div>
                                </button>
                            )}

                        </li>
                    ))}
                </ul>
            </Accordion>

            <Accordion disableGutters className="border-2 my-1 border-black shadow-none">
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
                            <div className="p-3 w-full border text-left flex gap-2 items-center rounded-lg justify-between">

                                <div className=" flex gap-2">
                                    <FaUser size={20}/>
                                    <p>{request.from_username}</p>
                                    <p className="text-sm grid place-items-center"># {request.from_user}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                    className="grid place-items-center px-3 py-1 hover:bg-green-600 hover:text-white duration-300 rounded-lg tooltip z-10" 
                                    onClick={() => handleAccept(request.friendshipId)}>
                                        <IoPersonAddOutline size={25}/>
                                        <div className="tooltip-text bg-green-600 text-white z-50">
                                            <p>Accept request</p>
                                        </div>
                                    </button>

                                    <button 
                                    className="grid place-items-center px-3 py-1 hover:bg-red-600 hover:text-white duration-300 rounded-lg tooltip z-10" 
                                    onClick={() => handleDenial(request.friendshipId)}>
                                        <TiDeleteOutline size={25}/>
                                        <div className="tooltip-text bg-red-600 text-white z-50">
                                            <p>Deny request</p>
                                        </div>
                                    </button>
                                </div>
                                

                            </div>
                        </li>
                    ))}
                </ul>
            </Accordion>

            <Accordion disableGutters className="border-2 my-1 border-black shadow-none">

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
                            <div className="p-3 w-full border text-left flex gap-2 items-center rounded-lg justify-between">

                                <div className=" flex gap-2">
                                    <FaUser size={20}/>
                                    <p>{request.to_username}</p>
                                    <p className="text-sm grid place-items-center"># {request.to_user}</p>
                                </div>

                                <button 
                                    className="grid place-items-center px-3 py-1 hover:bg-red-600 hover:text-white duration-300 rounded-lg tooltip z-0" 
                                    onClick={() => handleRemoval(request.friendshipId)}>
                                    <RiChatDeleteFill size={25}/>
                                    <div className="tooltip-text bg-red-600 text-white z-50">
                                        <p>Delete request</p>
                                    </div>
                                </button>

                            </div>
                        </li>
                    ))}
                </ul>
            </Accordion>

        </div>
    )
}

export default SelectionFriends