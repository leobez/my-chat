import { FaUser } from "react-icons/fa";
import { useEffect } from "react"
import { useGetFriends } from "../../hooks/friendshipHooks/useGetFriends"
import { useGetReceivedFriendsRequests } from "../../hooks/friendshipHooks/useGetReceivedFriendRequests";
import { useGetSentFriendsRequests } from "../../hooks/friendshipHooks/useGetSentFriendRequests";
import { MdExpandMore } from "react-icons/md";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

type Props = {}

const SelectionFriends = (props: Props) => {

    const {getFriends, friendsList} = useGetFriends()
    const {getReceivedFriendsRequests, requests:receivedRequests} = useGetReceivedFriendsRequests()
    const {getSentFriendsRequests, requests:sentRequests} = useGetSentFriendsRequests()

    useEffect(() => {
        getFriends()
        getReceivedFriendsRequests()
        getSentFriendsRequests()
    }, [])

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

                    {friendsList.length === 0 && <p>None</p>}

                    {friendsList.map((friend) => (
                        <li key={friend.userId} className="w-full">
                            <button className="p-3 w-full border text-left hover:bg-black hover:text-white duration-200 flex gap-2 items-center rounded-lg">
                                <FaUser size={20}/>
                                {friend.username}
                            </button>
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

                    {receivedRequests.map((request) => (
                        <li key={request.friendshipId} className="w-full">
                            <button className="p-3 w-full border text-left hover:bg-black hover:text-white duration-200 flex gap-2 items-center rounded-lg">
                                <FaUser size={20}/>
                                {request.user.username}
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

                    {sentRequests.map((request) => (
                        <li key={request.friendshipId} className="w-full">
                            <button className="p-3 w-full border text-left hover:bg-black hover:text-white duration-200 flex gap-2 items-center rounded-lg">
                                <FaUser size={20}/>
                                {request.user.username}
                            </button>
                        </li>
                    ))}
                </ul>
            </Accordion>

        </div>
    )
}

export default SelectionFriends