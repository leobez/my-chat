import { useEffect } from "react";

type Props = {
    clientSideFeedback?:string|null;
    serverSideFeedback?:any[]|null;
}

const FeedbackMessage = ({clientSideFeedback, serverSideFeedback}:Props) => {

    useEffect(() => {
        console.log('clientSideFeedback: ', clientSideFeedback)
        console.log('serverSideFeedback: ', serverSideFeedback) 
    }, [])

    if (!clientSideFeedback && serverSideFeedback?.length === 0) return;

    if (clientSideFeedback) {
        return (
            <div className="border-2 p-4 border-orange-500">
                <ul>
                    <li className="text-orange-500 font-bold w-fit">{clientSideFeedback}</li>
                </ul>
            </div>
        )
    }

    if (serverSideFeedback && serverSideFeedback.length > 0) {
        return (
            <div className="border-2 p-4 border-red-500">
                <ul>
                    {serverSideFeedback.map((message, index) => (
                        <li className="text-red-500 font-bold w-fit" key={index}>
                            {message}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
    
}

export default FeedbackMessage