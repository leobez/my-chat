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
import { createTheme, Tooltip, ThemeProvider } from "@mui/material";


const redTooltipTheme = createTheme({
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "#dc2626", // Cor de fundo
            color: "#fff", // Cor do texto
            fontSize: "12px", // Tamanho da fonte
          },
          arrow: {
            color: "#dc2626", // Cor da seta
          },
        },
      },
    },
});

const greenTooltipTheme = createTheme({
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "#16a34a", // Cor de fundo
            color: "#fff", // Cor do texto
            fontSize: "12px", // Tamanho da fonte
          },
          arrow: {
            color: "#16a34a", // Cor da seta
          },
        },
      },
    },
});

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
        <div className='h-full scrollbar-thin relative z-0 pr-2 overflow-x-hidden overflow-y-scroll'>

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
                                    className="p-3 w-full border-2 text-left bg-black text-white duration-300 flex gap-2 items-center rounded-lg justify-between" 
                                    onClick={() => updateChatting({type: 'friend', id: friend.userId})}>
                                    <div className="flex gap-3 items-center">
                                        <div className="h-full grid place-items-center">
                                            <FaUser size={25}/>
                                        </div>
                                        <div>
                                            <p className="overflow-ellipsis overflow-hidden whitespace-nowrap w-[120px] text-sm">{friend.username}</p>
                                            <p className="text-xs"># {friend.userId}</p>
                                        </div>
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

                                    <div className="flex gap-3 items-center">
                                        <div className="h-full grid place-items-center">
                                            <FaUser size={25}/>
                                        </div>
                                        <div>
                                            <p className="overflow-ellipsis overflow-hidden whitespace-nowrap w-[120px] text-sm">{friend.username}</p>
                                            <p className="text-xs"># {friend.userId}</p>
                                        </div>
                                    </div>

                                    <div>
                                        {friend.has_new_messages_ws && <p className="text-xs text-green-600 text-center">New message!</p>}
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
                <Typography component="span">Received friend requests</Typography>
                </AccordionSummary>

                <ul className="flex flex-col gap-1 p-2">

                    {receivedRequests.length === 0 && <p>None</p>}

                    {receivedRequests.map((request:Request) => (

                        <li key={request.friendshipId} className="w-full">

                            <div className="p-3 w-full border-2 text-left flex gap-2 items-center rounded-lg justify-between">

                                {/* FRIEND INFO */}
                                <div className="flex gap-2">
                                    <div className="flex gap-3 items-center">
                                        <div className="h-full grid place-items-center">
                                            <FaUser size={25}/>
                                        </div>
                                        <div>
                                            <p className="overflow-ellipsis overflow-hidden whitespace-nowrap w-[100px] text-sm">{request.from_username}</p>
                                            <p className="text-xs"># {request.from_user}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className="flex gap-2 relative overflow-visible">
                                    <ThemeProvider theme={greenTooltipTheme}>
                                        <Tooltip 
                                            title="Accept request" 
                                            placement="top" 
                                            arrow 
                                            slotProps={{popper: {modifiers: [{name: 'offset', options: {offset: [0, -6]}}]}}}
                                            >

                                            <button 
                                            className="grid place-items-center px-2 py-1 hover:bg-green-600 hover:text-white duration-300 rounded-lg tooltip border-2" 
                                            onClick={() => handleAccept(request.friendshipId)}>
                                                <IoPersonAddOutline size={20}/>
                                            </button>

                                        </Tooltip>
                                    </ThemeProvider>

                                    <ThemeProvider theme={redTooltipTheme}>
                                        <Tooltip 
                                            title="Deny request" 
                                            placement="top" 
                                            arrow 
                                            slotProps={{popper: {modifiers: [{name: 'offset', options: {offset: [0, -6]}}]}}}
                                            >

                                            <button 
                                            className="grid place-items-center px-2 py-1 hover:bg-red-600 hover:text-white duration-300 rounded-lg border-2" 
                                            onClick={() => handleDenial(request.friendshipId)}>
                                                <TiDeleteOutline size={20}/>
                                            </button>

                                        </Tooltip>
                                    </ThemeProvider>

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
                <Typography component="span">Sent friend requests</Typography>

                </AccordionSummary>

                <ul className="flex flex-col gap-1 p-2">

                    {sentRequests.length === 0 && <p>None</p>}

                    {sentRequests.map((request:Request) => (
                        <li key={request.friendshipId} className="w-full">
                            <div className="p-3 w-full border-2 text-left flex gap-2 items-center rounded-lg justify-between">

                                <div className=" flex gap-2">
                                    <div className="flex gap-3 items-center">
                                        <div className="h-full grid place-items-center">
                                            <FaUser size={25}/>
                                        </div>
                                        <div>
                                            <p className="overflow-ellipsis overflow-hidden whitespace-nowrap w-[100px] text-sm">{request.to_username}</p>
                                            <p className="text-xs"># {request.to_user}</p>
                                        </div>
                                    </div>
                                </div>

                                <ThemeProvider theme={redTooltipTheme}>
                                    <Tooltip 
                                        title="Delete request" 
                                        placement="top" 
                                        arrow 
                                        slotProps={{popper: {modifiers: [{name: 'offset', options: {offset: [0, -6]}}]}}}
                                        >
                                        <button 
                                            className="grid place-items-center px-2 py-1 hover:bg-red-600 hover:text-white duration-300 rounded-lg border-2" 
                                            onClick={() => handleRemoval(request.friendshipId)}>
                                            <RiChatDeleteFill size={20}/>
                                        </button>
                                    </Tooltip>
                                </ThemeProvider>

                            </div>
                        </li>
                    ))}
                </ul>
            </Accordion>

        </div>
    )
}

export default SelectionFriends