import { CircularProgress } from "@mui/material"

type Props = {
    message?: string
}

const Loading = ({message}: Props) => {
    return (
        <div className="bg-blue-800 h-full w-full grid place-items-center">
            <div className="w-1/2 h-48 bg-blue-600 rounded-lg shadow-lg text-white flex flex-col items-center justify-evenly">
                <CircularProgress size="3rem" sx={{ color: "white" }} />
                <p className="text-white font-bold text-lg">{message ?? "Carregando..."}</p>
            </div>
        </div>
    )
}

export default Loading