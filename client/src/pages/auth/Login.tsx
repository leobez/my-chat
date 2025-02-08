import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../../hooks/authHooks/useLogin'
import { MdLogin } from "react-icons/md";
import FormInput from '../../components/Form/FormInput'
import SnackbarContext, { SnackbarContextType } from '../../context/SnackbarContext';

const Login = () => {

    // FORM STATES
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [feedback, setFeedback] = useState<string>("")
    const {handleSnackbar} = useContext(SnackbarContext) as SnackbarContextType

    // HOOKS
    const {login, feedback:serverSideFeedback, loading:c_loading} = useLogin()

    // FUNCTIONS
    const handleSubmit = async(e:any) => {

        e.preventDefault()        
        setFeedback("")

        if (!username || username.length === 0) {
            return setFeedback('Preencha o campo de "Nome de usuário"')
        }

        if (!password) {
            return setFeedback('Preencha o campo de "Senha"')
        }

        if (password.length < 3) {
            return setFeedback('Sua senha deve ter pelo menos 3 caracteres')
        }

        login({
            username: username,
            password: password
        })
    }

    useEffect(() => {
        if (serverSideFeedback) setFeedback(serverSideFeedback[0])
    }, [serverSideFeedback])

    // Just to make login easier (REMOVE)
    useEffect(() => {
        setUsername('user1')
        setPassword('123')
    }, [])

    // Snackbar stuff
    useEffect(() => {
        if (feedback) {
            handleSnackbar({
                message: feedback,
                open: true,
                severity: 'warning'
            })
        } 
    }, [feedback])

    return (
        <div className='h-full flex flex-col md:flex-row justify-center gap-3'>

            <div className='h-full w-1/2 hidden md:flex flex-col items-center justify-center bg-blue-700 p-6 rounded-lg'>
                <div>
                    <p className='font-bold text-5xl text-white'>Já tem uma conta? Preencha as informações ao lado!</p>
                </div>
            </div>

            <div className='h-full w-full md:w-1/2 bg-blue-700 p-6 rounded-lg flex items-center justify-center'>
                
                <form onSubmit={handleSubmit} className='h-fit w-full flex flex-col gap-3'>

                    <div className='w-full flex items-center justify-center bg-blue-800 p-6 rounded-lg font-bold text-white gap-3'>
                        <MdLogin size={25}/>
                        <p className='text-white font-bold'>Login</p>
                    </div>

                    <div className='bg-blue-800 text-white p-6 space-y-3 rounded-lg'>
                        <label htmlFor="username" className='font-bold'>Nome de usuário: </label>
                        <input 
                            type="username" 
                            name='username'
                            id='username'
                            required
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            placeholder='Digite seu nome de usuário...'
                            className='w-full p-2 rounded-lg outline-none bg-gray-300 placeholder-slate-600 text-black'
                        />
                    </div>

                    <div className='bg-blue-800 text-white p-6 space-y-3 rounded-lg shadow-md'>
                        <label htmlFor="password" className='font-bold'>Senha: </label>
                        <input 
                            type="password" 
                            name='password'
                            id='password'
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder='Digite sua senha...'
                            className='w-full p-2 rounded-lg outline-none bg-gray-300 placeholder-slate-600 text-black'
                        />
                    </div>

                    <div className='flex gap-3'>
                        <FormInput
                            type="submit"
                            loading={{
                                state: c_loading,
                                value: "Entrando..."
                            }}
                            defaultValue="Entrar"
                        />
                        <Link to="/register" className='w-1/2 p-4 grid place-items-center text-white font-bold bg-blue-900 hover:bg-blue-950 rounded-lg duration-300'>
                            Não tem uma conta?
                        </Link>
                    </div>




                </form>


            </div>

        </div>
    )
}

export default Login