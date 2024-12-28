import { useContext } from "react"
import { useLogin } from "../../hooks/authHooks/useLogin"
import SocketContext, { SocketContextType } from "../../context/SocketContext"

const TestMessage = () => {

    const {login} = useLogin()
    const {connect} = useContext(SocketContext) as SocketContextType

    return (
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
        </div>
    )
}

export default TestMessage