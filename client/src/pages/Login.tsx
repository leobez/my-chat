import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../slices/AuthSlice'

const API_URL = "http://localhost:3000/api"

const Login = () => {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const dispatch = useDispatch()

    const handleSubmit = async(e:any) => {

        e.preventDefault()
        console.log('email: ', email)
        console.log('password: ', password)

        try {
            const URL = `${API_URL}/login`
            const RESULT = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                credentials: 'include'
            })

            const DATA = await RESULT.json()

            console.log('DATA: ', DATA)

            // Update login universal state
            if (DATA.message === 'logged') {
                dispatch(login())
            }

        } catch (error) {
            console.log(error)
        }
    }

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

            </form>

        </div>
    )
}

export default Login