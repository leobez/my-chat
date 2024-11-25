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
    const {register, serverSideFeedback} = useRegister()

    // FUNCTONS
    const handleSubmit = async(e:any) => {

        e.preventDefault()

        // TODO: ADD BETTER CLIENT-SIDE VERIFICATION
        if (!email || email.length === 0) {
            setClientSideFeedback('EMPTY EMAIL')
            return;
        }

        if (!username || username.length === 0) {
            setClientSideFeedback('EMPTY USERNAME')
            return;
        }

        if (!password || password.length <= 3) {
            setClientSideFeedback('PASSWORD TOO SHORT')
            return;
        }

        register(email, username, password)
    }

    return (

        <div className='p-4 border-2'>

            <p>Cadastro</p>

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
                    <label htmlFor="username">Username: </label>
                    <input 
                        type="text" 
                        name="username" 
                        id="username" 
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
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
                    <input type="submit" value="Registrar" className='border-2'/>
                    <Link to="/login">Já está cadastrado?</Link>
                </div>

                <FeedbackMessage message={clientSideFeedback}/>
                <FeedbackMessage message={serverSideFeedback}/>

            </form>

        </div>
    )
}

export default Register