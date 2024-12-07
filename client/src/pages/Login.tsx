import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import FeedbackMessage from '../components/FeedbackMessage'

const Login = () => {

    // FORM STATES
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [clientSideFeedback, setClientSideFeedback] = useState<string|null>(null)

    // HOOKS (the thing thats doing the talk with the server)
    const {login, serverSideFeedback, loading} = useLogin()

    // FUNCTIONS
    const handleSubmit = async(e:any) => {

        e.preventDefault()

        if (!email || email.length === 0) {
            setClientSideFeedback('EMPTY EMAIL')
            return;
        }

        if (!password) {
            setClientSideFeedback('PASSWORD EMPTY')
            return;
        }

        login(email, password)
    }

    // Just to make login easier (REMOVE)
    useEffect(() => {
        setEmail('email_test@email.com')
        setPassword('password_test')
    }, [])

    return (

        <div className='p-4 border-2 border-black grid place-items-center'>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-80 py-3'>
            
                <div className='border-b-2 border-black p-2'>
                    <p>LOGIN</p>
                </div>

                <div className='flex gap-1 flex-col'>
                    <label htmlFor="email" className='flex justify-start'>Email: </label>
                    <input 
                        type="text" 
                        name="email" 
                        id="email" 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='border-2 border-black w-full p-2'/>                
                </div>

                <div className='flex gap-1 flex-col'>
                    <label htmlFor="Senha" className='flex justify-start'>Password: </label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='border-2 border-black w-full p-2'/>
                </div>

                <div className='flex gap-2 justify-center'>
                    {loading ? (
                        <input type="submit" value="Entering" className='border-2 border-black px-3 py-2 w-2/6 cursor-pointer bg-black text-white' disabled/>
                    ) : (
                        <input type="submit" value="Enter" className='border-2 border-black px-3 py-2 w-2/6 cursor-pointer hover:bg-black hover:text-white duration-200'/>
                    )}
                        <Link to="/register" className='w-4/6 grid place-items-center hover:bg-black hover:text-white duration-200'>No account yet?</Link>
                </div>

                <FeedbackMessage clientSideFeedback={clientSideFeedback}/>
                <FeedbackMessage serverSideFeedback={serverSideFeedback}/>

            </form>

        </div>
    )
}

export default Login