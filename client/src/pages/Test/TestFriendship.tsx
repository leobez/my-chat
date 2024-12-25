import { useEffect } from 'react'
import { useListFriends } from '../../hooks/friendshipHooks/useListFriends'
import { useSelector } from 'react-redux'
import { useListReceivedRequests } from '../../hooks/friendshipHooks/useListReceivedRequests'
import { useListSentRequests } from '../../hooks/friendshipHooks/useListSentRequests'
import { useSendFriendRequest } from '../../hooks/friendshipHooks/useSendFriendRequest'
import { useAcceptFriendRequest } from '../../hooks/friendshipHooks/useAcceptFriendRequest'
import { useDenyFriendRequest } from '../../hooks/friendshipHooks/useDenyFriendRequest'
import { useDeleteFriendship } from '../../hooks/friendshipHooks/useDeleteFriendship'
import { useLogin } from '../../hooks/authHooks/useLogin'

const TestFriendship = () => {

    const {login} = useLogin()

    const {listFriends} = useListFriends()
    const {listReceivedRequests} = useListReceivedRequests()
    const {listSentRequests} = useListSentRequests()
    const {sendFriendRequest} = useSendFriendRequest()
    const {acceptFriendRequest} = useAcceptFriendRequest()
    const {denyFriendRequest} = useDenyFriendRequest()
    const {deleteFriendship} = useDeleteFriendship()

    const friends = useSelector((state:any) => state.friendship.friends)
    const sentRequest = useSelector((state:any) => state.friendship.sentRequests)
    const receivedRequest = useSelector((state:any) => state.friendship.receivedRequests)
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
            <button onClick={() => login({email: 'user1@email.com', password: '123'})} className='h-12 w-24 bg-slate-700'></button>
            <button onClick={() => sendFriendRequest(4)} className='h-12 w-24 bg-black'></button>
            <button onClick={() => acceptFriendRequest(3)} className='h-12 w-24 bg-red-400'></button>
            <button onClick={() => denyFriendRequest(3)} className='h-12 w-24 bg-green-400'></button>
            <button onClick={() => deleteFriendship(3)} className='h-12 w-24 bg-purple-400'></button>
        </div>
    )
}

export default TestFriendship