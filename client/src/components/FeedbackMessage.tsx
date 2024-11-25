type Props = {
    message: string|null;
}

const FeedbackMessage = ({message}:Props) => {

    if (!message) return;

    return (
        <div>
            <p>{message}</p>
        </div>
    )
}

export default FeedbackMessage