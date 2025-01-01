import { useContext, useEffect, useRef, useState } from "react"
import { useGetHistory } from "../../hooks/messageHooks/useGetHistory"
import { useSendMessage } from "../../hooks/messageHooks/useSendMessage"
import { useDispatch, useSelector } from "react-redux"
import { History, Message } from "../../slices/messageSlice"
import ChatContext, { ChatContextType } from "../../context/ChatContext"
import { IoMdSend } from "react-icons/io";
import { Friend } from "../../slices/friendshipSlice"
import { AiOutlineUserDelete } from "react-icons/ai";
import { useDeleteFriendship } from "../../hooks/friendshipHooks/useDeleteFriendship"
import { FaUser } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { removeHasNewMessagesWs } from "../../slices/friendshipSlice" 
import Loading from "../Loading"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material"

type Props = {
    userId: number
}

const FriendChat = (props: Props) => {

    // ids of friends and mine
    const me_id = useSelector((state:any) => state.auth.userId)
    const friend_id = props.userId
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(removeHasNewMessagesWs(friend_id))
    }, [])

    // Friend data
    const friends = useSelector((state:any) => state.friendship.friends)
    const [friend, setFriend] = useState<Friend|null>(null)

    // Hooks
    const {getHistoryWithUser} = useGetHistory()

    // Chatting context
    const {chatting, updateChatting} = useContext(ChatContext) as ChatContextType

    useEffect(() => {

        friends.forEach((friend:Friend) => {
            if (friend.userId === friend_id) {
                setFriend(friend)
            }
        })

        getHistoryWithUser(friend_id);

    }, [friends, friend_id])

    const allHistories = useSelector((state:any) => state.message.completeHistory)
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {

        const filteredHistory = allHistories.filter((history:History) => history.userId === friend_id);
        if (!filteredHistory.length) return;

        const relevantHistory = filteredHistory[0].history
        setMessages(relevantHistory)

    }, [allHistories, chatting])

    // Auto scroll to bottom of chat box when history updates
    const endOfChatBoxRef = useRef<any>(null)
    useEffect(() => {
        console.log('messages: ', messages)
        if (endOfChatBoxRef.current) {
            endOfChatBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages])

    // Send message function and state
    const {sendMessageTo} = useSendMessage()
    const [message, setMessage] = useState<string>('')

    const handleSubmit = async(e:any) => {

        e.preventDefault()

        if (!message.length) return;
        if (message.length > 150) return;

        await sendMessageTo(friend_id, message)

        setMessage("")
    }

    // Delete friend
    const {deleteFriendship} = useDeleteFriendship()
    const [deleteFriendModal, setDeleteFriendModal] = useState<boolean>(false)

    const handleCloseModal = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();
        setDeleteFriendModal(false)
    }

    const handleDelete = (friendshipId:number) => {
        deleteFriendship(friendshipId)
        setFriend(null)
        updateChatting(null)
    }

    // Close chat
    const handleClose = () => {
        updateChatting(null)
    }

    // Mount
    const [isMounted, setIsMounted] = useState<boolean>(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <Loading/>
        )
    }

    return (
        <>
            {friend && chatting && 

                <div className="w-full h-full">

                    <div className="flex flex-col h-full">

                        {/* CHAT HEADER */}
                        <div className="h-16 bg-black text-white font-bold flex justify-between items-center px-3">
    
                            <div className="flex items-center justify-start gap-5">

                                <div className="h-full grid place-items-center">
                                    <FaUser size={30}/>
                                </div>

                                <div>
                                    <p className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[250px] text-sm text-left">{friend.username}</p>
                                    <p className="text-xs text-left"># {friend.userId}</p>
                                </div>

                                <div>
                                    {
                                        friend.online ? (
                                            <div className="flex gap-2 items-center justify-center">
                                                <div className="h-4 w-4 rounded-full border-2 border-green-600 p-[2px]">
                                                    <div className="h-full w-full rounded-full bg-green-600"/>
                                                </div>
                                                <p className="text-xs font-thin text-green-600">Online</p>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 items-center justify-center">
                                                <div className="h-4 w-4 rounded-full border-2 border-red-600 p-[2px]">
                                                    <div className="h-full w-full rounded-full bg-red-600"/>
                                                </div>
                                                <p className="text-xs font-thin text-red-600">Offline</p>
                                            </div>
                                            
                                        )
                                    }
                                </div>
                            </div> 
                            
                            <div className="flex gap-3">
                                <button onClick={handleClose} className="border-2 border-white rounded-lg px-2">
                                    <IoMdClose size={30}/>
                                </button>
                                <div className="flex gap-2 items-center">
                                    <button 
                                        className="border-2 border-red-600 p-2 rounded-lg text-red-600 font-bold hover:bg-red-600 hover:text-white duration-300 flex gap-2"
                                        onClick={() => setDeleteFriendModal(true)}
                                        >

                                        <Dialog
                                            open={deleteFriendModal}
                                            onClose={handleCloseModal}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                            >
                                            <DialogTitle id="alert-dialog-title" className="text-black">
                                                {"Delete friendship"}
                                            </DialogTitle>

                                            <IconButton
                                                aria-label="close"
                                                onClick={handleCloseModal}
                                                sx={(theme) => ({
                                                    position: 'absolute',
                                                    right: 8,
                                                    top: 8,
                                                    color: theme.palette.grey[500],
                                                })}
                                                >

                                                <IoMdClose size={25}/>

                                            </IconButton>

                                            <DialogContent className="p-3">
                                                <DialogContentText id="alert-dialog-description">
                                                    Do you really want to delete this friendship?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions className="p-3 grid place-items-center">
                                                <button 
                                                    className="border-2 border-black rounded-lg hover:bg-black hover:text-red-500 duration-300 p-2" 
                                                    onClick={() => handleDelete(friend.friendshipId)}>
                                                        Delete friend
                                                </button>
                                            </DialogActions>
                                        </Dialog>

                                        <p className="font-thin">Delete friend</p>

                                        <AiOutlineUserDelete size={25}/>

                                    </button>
                                </div>
                            </div>

                        </div>
                        
                        {/* CHAT BOX */}
                        <div className='w-full flex-1 flex flex-col gap-4 overflow-y-auto p-2 scrollbar-thin'>
    
                            {messages && messages.map((message:Message) => (
    
                                <div key={message.messageId} className='flex flex-col'>
    
                                    {/* MY MESSAGE */}
                                    {Number(message.from_user) === Number(me_id) && 
                                        <div className='rounded-xl border-2 bg-slate-200 text-black w-1/2 self-start h-fit p-3 break-words flex flex-col gap-2'>
                                            
                                            <div className="flex gap-2">
                                                {/* SENT BY */}
                                                <p className="text-xs text-çeft"># {message.from_username}</p>

                                                {/* SENT DATE */}
                                                <p className="text-xs text-left">| {message.created_at}</p>
                                            </div>
                                            
                                            <span className="h-[1px] bg-black w-full"></span>

                                            {/* CONTENT */}
                                            <p className='text-left'>{message.content}</p>
                                            
                                        </div>
                                    }
    
                                    {/* OTHER PERSON MESSAGE */}
                                    {Number(message.from_user) === Number(friend_id) && 
                                        <div className='rounded-xl border-2 bg-slate-900 text-white w-1/2 self-end h-fit p-3 break-words flex flex-col gap-2'>

                                            <div className="flex gap-2">
                                                {/* SENT BY */}
                                                <p className="text-xs text-çeft"># {message.from_username}</p>

                                                {/* SENT DATE */}
                                                <p className="text-xs text-left">| {message.created_at}</p>
                                            </div>
                                            
                                            <span className="h-[1px] bg-white w-full"></span>

                                            {/* CONTENT */}
                                            <p className='text-left'>{message.content}</p>

                                        </div>
                                    }
    
                                </div>
                            ))}
    
                            <div ref={endOfChatBoxRef}/>
    
                        </div>
    
                        {/* MESSAGE AREA */}
                        <form onSubmit={handleSubmit} className='flex w-full h-14'>
                            
                            <textarea 
                                name="message" 
                                id="message" 
                                className='border-t-2 border-black w-10/12 resize-none outline-none px-2 py-2 rounded-b-lg scrollbar-thin' 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)}>
                            </textarea>
    
                            <button 
                            onClick={handleSubmit} 
                            className='border-t-2 border-l-2 border-black hover:bg-black hover:text-white duration-300 px-2 cursor-pointer w-2/12 grid place-items-center'>
                                <IoMdSend size={25}/>
                            </button>
    
                        </form>
    
                    </div>
                
                </div>
            }
        </>
        
    )
}

export default FriendChat