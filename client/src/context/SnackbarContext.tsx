import { createContext, ReactNode, useState } from "react";


export interface SnackbarContextType {
    open:boolean
    message:string 
    severity: "success" | "info" | "warning" | "error"
    handleSnackbar:({open, message, severity}:{open:boolean, message:string, severity:any})=>void
}

const SnackbarContext = createContext<SnackbarContextType|undefined>(undefined)

interface SnackbarContextProps {
    children: ReactNode
}

export function SnackbarContextProvider({children}:SnackbarContextProps) {

    const [open, setOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [severity, setSeverity] = useState<any>('')

    const handleSnackbar = ({open, message, severity}:{open:boolean, message:string, severity:any}) => {
        setMessage(message)
        setOpen(open)
        setSeverity(severity)
    }

    return (
        <SnackbarContext.Provider value={{
            open,
            message,
            severity,
            handleSnackbar
        }}>

            {children}

        </SnackbarContext.Provider>
    )
}

export default SnackbarContext