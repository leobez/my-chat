import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../../hooks/userHooks/auth/useLogin'
import Form from '../../components/Form/Form'

const Login = () => {

    // FORM STATES
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [feedback, setFeedback] = useState<string[]>([])

    // HOOKS
    const {login, serverSideFeedback, loading:c_loading} = useLogin()

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

        login(email, password)
    }

    useEffect(() => {
        setFeedback(serverSideFeedback)
    }, [serverSideFeedback])

    // Just to make login easier (REMOVE)
    useEffect(() => {
        setEmail('user1@email.com')
        setPassword('123')
    }, [])

    return (

        <div className='p-4 border-2 border-black grid place-items-center'>

            <Form

                name='Login'

                fields={[
                    {
                        name: 'email',
                        type: 'text',
                        id: 'email',
                        onChangeFunction: (e) => setEmail(e.target.value),
                        value: email
                    },
                    {
                        name: 'password',
                        type: 'text',
                        id: 'password',
                        onChangeFunction: (e) => setPassword(e.target.value),
                        value: password
                    }
                ]}

                submitInput={{
                    loading: {
                        state: c_loading,
                        value: "Entering"
                    },
                    defaultValue: 'Enter'
                }}

                feedback={{
                    messages: feedback
                }}

                onSubmitFunction={handleSubmit}
            >

                <Link 
                    to="/register" 
                    className='w-full px-3 py-2 grid place-items-center hover:bg-black border border-black hover:text-white duration-200'>
                        No account yet?
                </Link>

            </Form>

        </div>
    )
}

export default Login