import { useSelector } from "react-redux"
import { CiUser } from "react-icons/ci";
import { FormEvent, useState } from "react";

const Profile = () => {

    const user = useSelector((state:any) => state.auth) 

    const [newUserName, setNewUsername] = useState<string>(user.username)
    const [newPassword, setNewPassword] = useState<string>('')

    const handleSubmitNewUsername = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    const handleSubmitNewPassword = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div className="h-full w-full bg-blue-600 rounded-lg flex p-3">

            <div className="flex gap-5 h-fit justify-center items-center">

                <div className="p-10 h-fit grid place-items-center text-white bg-blue-800 rounded-full">
                    <CiUser size={100}/>
                </div>
                
                <div className="flex flex-col gap-5 justify-center bg-blue-800 rounded-lg p-5">

                    {/* Change username */}
                    <form className="flex gap-5 bg-blue-600 p-3 rounded-lg" onSubmit={handleSubmitNewUsername}>

                        <div className="flex flex-col rounded-lg gap-2">
                            <label htmlFor="newUsername" className="text-white font-bold">Nome de usuário:</label>
                            <input 
                                type="text" 
                                id="newUsername"
                                value={newUserName}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="p-3 rounded-lg outline-none border-none"
                            />
                        </div>

                        <button 
                            type="submit"
                            className="bg-blue-800 flex flex-col gap-3 items-center justify-center px-4 py-3 text-white hover:bg-blue-950 duration-300 rounded-lg h-fit self-end">
                            Atualizar
                        </button>

                    </form>

                    {/* Change password */}
                    <form className="flex gap-5 bg-blue-600 p-3 rounded-lg" onSubmit={handleSubmitNewPassword}>

                        <div className="flex flex-col rounded-lg gap-2">
                            <label htmlFor="newPassword" className="text-white font-bold">Senha:</label>
                            <input 
                                type="text" 
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="p-3 rounded-lg outline-none border-none"
                            />
                        </div>

                        <button 
                            type="submit"
                            className="bg-blue-800 flex flex-col gap-3 items-center justify-center px-4 py-3 text-white hover:bg-blue-950 duration-300 rounded-lg h-fit self-end">
                            Atualizar
                        </button>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default Profile