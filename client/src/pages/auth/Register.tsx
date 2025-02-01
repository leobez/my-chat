import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../../hooks/authHooks/useRegister'
import { MdAccountBox } from "react-icons/md";
import FormInput from '../../components/Form/FormInput';
import { Alert, Snackbar } from '@mui/material';


export interface Snackbar {
    severity: "success" | "info" | "warning" | "error"
    message: string 
}

const Register = () => {

    // FORM STATES
    const [email, setEmail] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [feedback, setFeedback] = useState<string>("teste")

    // HOOKS
    const {register, feedback:serverSideFeedback, loading:c_loading} = useRegister()

    // FUNCTONS
    const handleSubmit = async(e:any) => {

        e.preventDefault()
        setFeedback([])

        if (!email || email.length === 0) {
            return setFeedback('Email empty')
        }

        if (!username || username.length === 0) {
            return setFeedback('Username empty')
        }

        if (!password) {
            return setFeedback('Password empty')
        }

        if (password.length < 3) {
            return setFeedback('Password minimum length: 3')
        }

        register({
            email: email,
            password: password,
            username: username
        })
    }

    useEffect(() => {
        setFeedback(serverSideFeedback[0])
    }, [serverSideFeedback])

    // Snackbar stuff
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [snackbar, setSnackbar] = useState<Snackbar|null>(null)
    useEffect(() => {
        if (feedback) {
            setSnackbar({
                severity: 'info',
                message: feedback
            })
        } 
    }, [feedback])
    useEffect(() => {
        setOpenSnackbar(true)
    }, [snackbar])

    return (
        <div className='h-full flex flex-col md:flex-row justify-center p-3 gap-3'>
            
            <Snackbar 
                open={openSnackbar} 
                //autoHideDuration={5000} 
                onClose={() => setOpenSnackbar(false)} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbar?.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar?.message}
                </Alert>
            </Snackbar>

            <div className='h-full w-1/2 hidden md:flex flex-col items-center justify-center bg-blue-700 px-10 rounded-lg'>
                <div>
                    <p className='font-bold text-5xl text-white'>Ainda não tem uma conta? Preencha as informações ao lado e crie uma!</p>
                </div>
            </div>

            <div className='h-full w-full md:w-1/2 bg-blue-700 px-10 rounded-lg flex items-center justify-center'>
                
                <form onSubmit={handleSubmit} className='h-fit w-full flex flex-col gap-3'>

                    <div className='w-full flex items-center justify-center bg-blue-800 p-6 rounded-lg font-bold text-white gap-3'>
                        <MdAccountBox size={25}/>
                        <p className='text-white font-bold'>Cadastro</p>
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
                                value: "Cadastrando..."
                            }}
                            defaultValue="Cadastrar"
                        />
                        <Link to="/login" className='w-1/2 p-4 grid place-items-center text-white font-bold bg-blue-900 hover:bg-blue-950 rounded-lg duration-300'>
                            Já tem uma conta?
                        </Link>
                    </div>

                </form>

            </div>

        </div>
    )
}

export default Register