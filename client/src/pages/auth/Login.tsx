import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLogin } from '../../hooks/authHooks/useLogin'
import Form from '../../components/Form/Form'
import Loading from '../../components/Loading'
import { MdLogin } from "react-icons/md";
import { MdAccountBox } from "react-icons/md";
import FormInput from '../../components/Form/FormInput'

const Login = () => {

    // FORM STATES
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [feedback, setFeedback] = useState<string[]>([])

    // HOOKS
    const {login, feedback:serverSideFeedback, loading:c_loading} = useLogin()

    // FUNCTIONS
    const handleSubmit = async(e:any) => {

        e.preventDefault()        
        setFeedback([])
        let feedbackCount=0


        if (!email || email.length === 0) {
            setFeedback((prev) => [...prev, 'Email empty'])
            feedbackCount++
        }

        if (!password) {
            setFeedback((prev) => [...prev, 'Password empty'])
            feedbackCount++
        }

        if (feedbackCount > 0) return;

        login({
            email: email,
            password: password
        })
    }

    useEffect(() => {
        setFeedback(serverSideFeedback)
    }, [serverSideFeedback])

    // Just to make login easier (REMOVE)
    useEffect(() => {
        setEmail('user1@email.com')
        setPassword('123')
    }, [])

    const [isMounted, setIsMounted] = useState<boolean>(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <Loading/>
        )
    }

    return (
        <div className='h-full flex flex-col md:flex-row justify-center p-3 gap-3'>

            <div className='h-full w-1/2 hidden md:flex flex-col items-center justify-center bg-blue-700 px-10 rounded-lg'>
                <div>
                    <p className='font-bold text-5xl text-white'>Já tem uma conta? Preencha as informações ao lado!</p>
                </div>
            </div>

            <div className='h-full w-full md:w-1/2 bg-blue-700 px-10 rounded-lg flex items-center justify-center'>
                
                <form onSubmit={handleSubmit} className='h-fit w-full flex flex-col gap-3'>

                    <div className='w-full flex items-center justify-center bg-blue-800 p-6 rounded-lg font-bold text-white gap-3'>
                        <MdLogin size={25}/>
                        <p className='text-white font-bold'>Login</p>
                    </div>

                    <div className='bg-blue-800 text-white p-6 space-y-3 rounded-lg'>
                        <label htmlFor="email" className='font-bold'>Email: </label>
                        <input 
                            type="email" 
                            name='email'
                            id='email'
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder='Digite seu email...'
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