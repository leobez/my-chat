type Props = {
    feedback: {
        messages: string[]
    }
}

const FormFeedback = (props :Props) => {

    return (
        <div className="border-2 border-black p-4">
            <ul>
                {props.feedback.messages.map((message, index) => (
                    <li className="font-bold w-fit" key={index}>
                        {message}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FormFeedback