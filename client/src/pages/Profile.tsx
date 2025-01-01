import { TextField } from "@mui/material"
import { useSelector } from "react-redux"

const Profile = () => {

    const user = useSelector((state:any) => state.auth) 

    return (
        <div className="h-full w-full border-2 border-black rounded-lg flex p-4">

            <div className="flex flex-col gap-5 h-fit">

                {/* IMAGE */}
                <div className="flex gap-5 justify-center items-center">

                    <div className="h-32 w-32 rounded-full bg-black"/>

                    <div className="flex flex-col">
                        <p className="text-left font-bold">{user.username} <span className="text-xs">#{user.userId}</span></p>
                        <p className="text-left font-bold">{user.email}</p>
                    </div>

                </div>
                

                {/* INFO */}
                <div className="flex flex-col gap-5">

                    <div className="flex flex-col gap-3">

                        <div className="flex flex-col border-2 rounded-lg p-2">
                            <p className="text-left text-xs">Wanna update your username?</p>
                            <TextField id="standard-basic" variant="standard" size="small" />
                        </div>

                        <div className="flex flex-col border-2 rounded-lg p-2">
                            <p className="text-left text-xs">Wanna update your email?</p>
                            <TextField id="standard-basic" variant="standard" size="small" />
                        </div>

                        <div className="flex flex-col border-2 rounded-lg p-2">
                            <p className="text-left text-xs">Wanna update your password?</p>
                            <TextField id="standard-basic" variant="standard" size="small" />
                        </div>

                    </div>

                </div>
                
            </div>

        </div>
    )
}

export default Profile