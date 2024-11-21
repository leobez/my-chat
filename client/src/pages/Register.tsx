import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = "http://localhost:3000/api"

const Register = () => {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = async(e:any) => {
        e.preventDefault()
        console.log('email: ', email)
        console.log('password: ', password)

        try {
            const URL = `${API_URL}/register`
            const RESULT = await fetch(URL)
            const DATA = await RESULT.json()
            console.log('DATA: ', DATA) 
        } catch (error) {
            console.log(error)
        }
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

            </form>

        </div>
    )
}

export default Register