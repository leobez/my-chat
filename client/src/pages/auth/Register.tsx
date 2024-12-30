import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../../hooks/authHooks/useRegister'
import Form from '../../components/Form/Form'

const Register = () => {

    // FORM STATES
    const [email, setEmail] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [feedback, setFeedback] = useState<string[]>([])

    // HOOKS
    const {register, feedback:serverSideFeedback, loading:c_loading} = useRegister()

    // FUNCTONS
    const handleSubmit = async(e:any) => {

        e.preventDefault()
        setFeedback([])
        let feedbackCount=0

        if (!email || email.length === 0) {
            setFeedback((prev) => [...prev, 'Email empty'])
            feedbackCount++
        }

        if (!username || username.length === 0) {
            setFeedback((prev) => [...prev, 'Username empty'])
            feedbackCount++
        }

        if (!password) {
            setFeedback((prev) => [...prev, 'Password empty'])
            feedbackCount++
        }

        if (password.length < 3) {
            setFeedback((prev) => [...prev, 'Password minimum length: 3'])
            feedbackCount++
        }

        if (feedbackCount > 0) return;

        register({
            email: email,
            password: password,
            username: username
        })
    }

    useEffect(() => {
        setFeedback(serverSideFeedback)
    }, [serverSideFeedback])

    return (

        <div className='p-4 border-2 border-black grid place-items-center'>

            <Form

                name='Register'

                fields={[
                    {
                        name: 'email',
                        type: 'text',
                        id: 'email',
                        onChangeFunction: (e) => setEmail(e.target.value),
                        value: email
                    },
                    {
                        name: 'username',
                        type: 'text',
                        id: 'username',
                        onChangeFunction: (e) => setUsername(e.target.value),
                        value: username
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
                        value: "Registering"
                    },
                    defaultValue: 'Register'
                }}

                feedback={{
                    messages: feedback
                }}

                onSubmitFunction={handleSubmit}
            >

                <Link 
                    to="/login" 
                    className='w-full px-3 py-2 grid place-items-center hover:bg-black border-2 border-black hover:text-white duration-200'>
                        Already have an account?
                </Link>
            
            </Form>

        </div>
    )
}

export default Register