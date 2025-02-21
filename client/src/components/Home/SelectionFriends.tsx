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
        <div className='h-full scrollbar-thin relative z-0 pr-3 overflow-x-hidden overflow-y-scroll'>

            <Accordion defaultExpanded disableGutters className="my-1 shadow-none" sx={{backgroundColor: '#1e40af', color: 'white', padding: '0.75rem'}}>

                <AccordionSummary
                expandIcon={<MdExpandMore size={20} color="white"/>}
                aria-controls="friends-content"
                id="friends-header"
                >
                <Typography component="span" sx={{fontWeight: 'bold'}}>Lista de amigos</Typography>
                </AccordionSummary>

                <ul className="flex flex-col gap-1 p-3 bg-blue-600 rounded-lg">

                    {friends.length === 0 && <p className="font-bold pl-1">Nenhum</p>}

                    {friends.map((friend:Friend) => (
                        <li key={friend.userId} className="w-full">

                            <button 
                            className={`p-3 w-full text-left text-white ${friend.userId === chatting?.id ? "bg-blue-950" : "bg-blue-800 hover:bg-blue-950"} duration-300 flex gap-2 items-center rounded-lg justify-between`}
                            onClick={() => updateChatting({type: 'friend', id: friend.userId})}>

                                <div className="flex gap-3 items-center">

                                    <div className="h-full grid place-items-center">
                                        <FaUser size={25}/>
                                    </div>

                                    <div>
                                        <p className="overflow-ellipsis overflow-hidden whitespace-nowrap w-[120px] text-sm font-bold">{friend.username}</p>
                                        <p className="text-xs font-bold"># {friend.userId}</p>
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
                        </li>
                    ))}
                </ul>

            </Accordion>

            <Accordion defaultExpanded disableGutters className="my-1 shadow-none" sx={{backgroundColor: '#1e40af', color: 'white', padding: '0.75rem'}}>

                <AccordionSummary
                expandIcon={<MdExpandMore size={20} color="white"/>}
                aria-controls="friends-content"
                id="friends-header"
                >
                <Typography component="span" sx={{fontWeight: 'bold'}}>Pedidos de amizade recebidos</Typography>
                </AccordionSummary>

                <ul className="flex flex-col gap-1 p-3 bg-blue-600 rounded-lg">

                    {receivedRequests.length === 0 && <p className="font-bold pl-1">Nenhum</p>}

                    {receivedRequests.map((request:Request) => (
                        <li key={request.friendshipId} className="w-full">

                            <div className="p-3 w-full bg-blue-800 flex gap-2 items-center rounded-lg justify-between">

                                {/* FRIEND INFO */}
                                <div className="flex gap-2 w-3/5">
                                    <div className="flex gap-3 items-center w-full">
                                        <div className="h-full grid place-items-center w-1/5">
                                            <FaUser size={25}/>
                                        </div>
                                        <div className="w-4/5">
                                            <p className="overflow-ellipsis overflow-hidden whitespace-nowrap w-full text-sm">{request.from_username}</p>
                                            <p className="text-xs w-full"># {request.from_user}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className="flex gap-2 relative overflow-visible w-2/5">
                                    <ThemeProvider theme={greenTooltipTheme}>
                                        <Tooltip 
                                            title="Aceitar pedido" 
                                            placement="top" 
                                            arrow 
                                            slotProps={{popper: {modifiers: [{name: 'offset', options: {offset: [0, -6]}}]}}}
                                            >

                                            <button 
                                            className="grid place-items-center p-2 hover:bg-green-600 hover:text-white duration-300 rounded-lg tooltip bg-blue-950" 
                                            onClick={() => handleAccept(request.friendshipId)}>
                                                <IoPersonAddOutline size={20}/>
                                            </button>

                                        </Tooltip>
                                    </ThemeProvider>

                                    <ThemeProvider theme={redTooltipTheme}>
                                        <Tooltip 
                                            title="Recusar pedido" 
                                            placement="top" 
                                            arrow 
                                            slotProps={{popper: {modifiers: [{name: 'offset', options: {offset: [0, -6]}}]}}}
                                            >

                                            <button 
                                            className="grid place-items-center p-2 hover:bg-red-600 hover:text-white duration-300 rounded-lg bg-blue-950" 
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

            <Accordion defaultExpanded disableGutters className="my-1 shadow-none" sx={{backgroundColor: '#1e40af', color: 'white', padding: '0.75rem'}}>

                <AccordionSummary
                    expandIcon={<MdExpandMore size={20} color="white"/>}
                    aria-controls="sent-requests-content"
                    id="sent-requests-header"
                >
                <Typography component="span" sx={{fontWeight: 'bold'}}>Pedidos de amizade enviados</Typography>

                </AccordionSummary>

                <ul className="flex flex-col gap-1 p-3 bg-blue-600 rounded-lg">

                    {sentRequests.length === 0 && <p className="font-bold pl-1">Nenhum</p>}

                    {sentRequests.map((request:Request) => (
                        <li key={request.friendshipId} className="w-full">
                            <div className="p-3 w-full bg-blue-800 text-left flex gap-2 items-center rounded-lg justify-between">

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
                                        title="Deletar pedido" 
                                        placement="top" 
                                        arrow 
                                        slotProps={{popper: {modifiers: [{name: 'offset', options: {offset: [0, -6]}}]}}}
                                        >
                                        <button 
                                            className="grid place-items-center px-3 py-2 hover:bg-red-600 hover:text-white duration-300 rounded-lg bg-blue-950" 
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