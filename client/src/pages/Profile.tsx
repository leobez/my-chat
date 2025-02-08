import { useSelector } from "react-redux"
import { CiUser } from "react-icons/ci";

const Profile = () => {

    const user = useSelector((state:any) => state.auth) 

    return (
        <div className="h-full w-full bg-blue-600 rounded-lg flex p-4">

            <div className="flex flex-col gap-5 h-fit">

                {/* IMAGE */}
                <div className="flex gap-5 justify-center items-center">

                    <div className="p-5 grid place-items-center text-white bg-blue-800 rounded-full">
                        <CiUser size={100}/>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-left font-bold">{user.username} <span className="text-xs">#{user.userId}</span></p>
                        <p className="text-left font-bold">{user.email}</p>
                    </div>

                </div>
                

                {/* INFO */}
                <form className="flex flex-col gap-5 text-white">

                    <div className="flex flex-col border-2 rounded-lg p-2">
                        <p className="text-left text-sm font-bold">Novo nome de usuário:</p>
                        
                    </div>

                    <div className="flex flex-col border-2 rounded-lg p-2">
                        <p className="text-left text-sm font-bold">Novo e-mail:</p>
                        
                    </div>

                    <div className="flex flex-col border-2 rounded-lg p-2">
                        <p className="text-left text-sm font-bold">Nova senha:</p>
                        
                    </div>

                </form>
                
            </div>

        </div>
    )
}

export default Profile