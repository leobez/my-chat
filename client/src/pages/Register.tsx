import { useState } from 'react'
import { Link } from 'react-router-dom'
import FeedbackMessage from '../components/FeedbackMessage'
import { useRegister } from '../hooks/useRegister'

const Register = () => {

    // FORM STATES
    const [email, setEmail] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [clientSideFeedback, setClientSideFeedback] = useState<string|null>(null)

    // HOOKS (the thing thats doing the talk with the server)
    const {register, serverSideFeedback, loading} = useRegister()

    // FUNCTONS
    const handleSubmit = async(e:any) => {

        e.preventDefault()
        setClientSideFeedback("")

        if (!email || email.length === 0) {
            setClientSideFeedback('EMPTY EMAIL')
            return;
        }

        if (!username || username.length === 0) {
            setClientSideFeedback('EMPTY USERNAME')
            return;
        }

        if (!password || password.length == 3) {
            setClientSideFeedback('PASSWORD EMPTY')
            return;
        }

        if (password.length <= 3) {
            setClientSideFeedback('MINIMUM PASSWORD LENGTH: 3')
            return;
        }

        register(email, username, password)
    }

    return (

        <div className='p-4 border-2 border-black grid place-items-center'>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-80 py-3'>

                <div className='border-b-2 border-black p-2'>
                    <p>REGISTER</p>
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
                    <label htmlFor="username" className='flex justify-start'>Username: </label>
                    <input 
                        type="text" 
                        name="username" 
                        id="username" 
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
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
                        <input type="submit" value="Registering" className='border-2 border-black px-3 py-2 w-2/6 cursor-pointer bg-black text-white' disabled/>
                    ) : (
                        <input type="submit" value="Register" className='border-2 border-black px-3 py-2 w-2/6 cursor-pointer hover:bg-black hover:text-white duration-200'/>
                    )}
                    <Link to="/login" className='w-4/6 grid place-items-center hover:bg-black hover:text-white duration-200'>Already has an account?</Link>
                </div>
                
                {loading && <div>Loading...</div>}
                <FeedbackMessage clientSideFeedback={clientSideFeedback}/>
                <FeedbackMessage serverSideFeedback={serverSideFeedback}/>

            </form>

        </div>
    )
}

export default Register