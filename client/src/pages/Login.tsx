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
    const {login, serverSideFeedback} = useLogin()

    // FUNCTIONS
    const handleSubmit = async(e:any) => {

        e.preventDefault()

        // TODO: ADD BETTER CLIENT-SIDE VERIFICATION
        if (!email || email.length === 0) {
            setClientSideFeedback('EMPTY EMAIL')
            return;
        }

        if (!password || password.length <= 3) {
            setClientSideFeedback('PASSWORD TOO SHORT')
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

        <div className='p-4 border-2'>

            <p>Login</p>

            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>

                <div>
                    <label htmlFor="email">Email: </label>
                    <input 
                        type="text" 
                        name="email" 
                        id="email" 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='border-2'/>                
                </div>

                <div>
                    <label htmlFor="Senha">Senha: </label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='border-2'/>
                </div>

                <div className='flex gap-2 justify-center'>
                    <input type="submit" value="Entrar" className='border-2'/>
                    <Link to="/register">Ainda não tem uma conta?</Link>
                </div>

                <FeedbackMessage message={clientSideFeedback}/>
                <FeedbackMessage message={serverSideFeedback}/>

            </form>

        </div>
    )
}

export default Login