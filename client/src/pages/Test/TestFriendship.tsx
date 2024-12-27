import { useContext, useEffect } from 'react'
import { useListFriends } from '../../hooks/friendshipHooks/useListFriends'
import { useSelector } from 'react-redux'
import { useListReceivedRequests } from '../../hooks/friendshipHooks/useListReceivedRequests'
import { useListSentRequests } from '../../hooks/friendshipHooks/useListSentRequests'
import { useSendFriendRequest } from '../../hooks/friendshipHooks/useSendFriendRequest'
import { useAcceptFriendRequest } from '../../hooks/friendshipHooks/useAcceptFriendRequest'
import { useDenyFriendRequest } from '../../hooks/friendshipHooks/useDenyFriendRequest'
import { useDeleteFriendship } from '../../hooks/friendshipHooks/useDeleteFriendship'
import { useLogin } from '../../hooks/authHooks/useLogin'
import SocketContext, { SocketContextType } from '../../context/SocketContext'
import { Friend } from '../../slices/friendshipSlice'
import { useSocket } from '../../hooks/useSocket'

const TestFriendship = () => {

    const {login} = useLogin()
    const {listFriends} = useListFriends()
    const {listReceivedRequests} = useListReceivedRequests()
    const {listSentRequests} = useListSentRequests()
    const {sendFriendRequest} = useSendFriendRequest()
    const {acceptFriendRequest} = useAcceptFriendRequest()
    const {denyFriendRequest} = useDenyFriendRequest()
    const {deleteFriendship} = useDeleteFriendship()
    const {connect} = useContext(SocketContext) as SocketContextType
    useSocket()

    const friends = useSelector((state:any) => state.friendship.friends)
    const receivedRequest = useSelector((state:any) => state.friendship.receivedRequests)
    const sentRequest = useSelector((state:any) => state.friendship.sentRequests)
    const profile = useSelector((state:any) => state.auth)

    useEffect(() => {listFriends()}, [])
    useEffect(() => {listReceivedRequests()}, [])
    useEffect(() => {listSentRequests()}, [])

    useEffect(() => {if (profile) console.log('profile: ', profile)}, [profile])
    useEffect(() => {if (friends) console.log('Friends: ', friends)}, [friends])
    useEffect(() => {if (sentRequest) console.log('sentRequest: ', sentRequest)}, [sentRequest])
    useEffect(() => {if (receivedRequest) console.log('receivedRequest: ', receivedRequest)}, [receivedRequest])

    return (
        <div>  
            <div>
                <p>Friends</p>
                <div className='flex gap-2'>
                    {friends && friends.map((friend:Friend) => (
                        <div key={friend.userId} className='border-2 border-black w-fit h-16 p-2 flex gap-2 items-center justify-center'>
                            <p>{friend.username}</p>
                            <p>{friend.online ? 'online' : 'offline'}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='p-3 flex gap-2 items-center justify-center'>

                <button 
                    onClick={() => login({email: 'user1@email.com', password: '123'})}
                    className='h-16 p-2 w-24 bg-white border-2 border-black'>
                    LOGIN
                </button>

                <button 
                    onClick={() => connect()} 
                    className='h-16 p-2 w-24 bg-white border-2 border-black'>
                    WS
                </button>

                <button 
                    onClick={() => sendFriendRequest(4)} 
                    className='h-16 p-2 w-24 bg-white border-2 border-black'>
                    SEND FR.REQ.
                </button>

                <button 
                    onClick={() => acceptFriendRequest(3)} 
                    className='h-16 p-2 w-24 bg-white border-2 border-black'>
                    ACCEPT FR.REQ.
                </button>

                <button 
                    onClick={() => denyFriendRequest(3)} 
                    className='h-16 p-2 w-24 bg-white border-2 border-black'>
                    DENY FR.REQ.
                </button>

                <button 
                    onClick={() => deleteFriendship(2)} 
                    className='h-16 p-2 w-24 bg-white border-2 border-black'>
                    DELETE FR.
                </button>

            </div>
        </div>
    )
}



export default TestFriendship;