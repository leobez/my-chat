import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { FaUser } from "react-icons/fa";

type Props = {
    isLogged:boolean
}

const Navbar = ({isLogged}: Props) => {

    const userId = useSelector((state:any) => state.auth.userId)
    const username = useSelector((state:any) => state.auth.username)

    return (
        <nav className='border-2 p-2 my-2 border-black flex justify-between'>

            <ul className='flex gap-2 p-2'>

                { !isLogged && <li><NavLink to="/login" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg" : "py-2 px-3 rounded-lg hover:bg-black hover:text-white cursor-pointer duration-200"
                    }>
                    Login
                    </NavLink>
                </li> }

                { !isLogged && <li><NavLink to="/register" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg" : "py-2 px-3 rounded-lg hover:bg-black hover:text-white cursor-pointer duration-200"
                    }>
                    Register
                    </NavLink>
                </li> }

                { isLogged && <li><NavLink to="/" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg" : "py-2 px-3 rounded-lg hover:bg-black hover:text-white cursor-pointer duration-200"
                    }>
                    Home
                    </NavLink>
                </li> }

                { isLogged && <li><NavLink to="/add" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg" : "py-2 px-3 rounded-lg hover:bg-black hover:text-white cursor-pointer duration-200"
                    }>
                    Add a friend
                    </NavLink>
                </li> }

                { isLogged && <li><NavLink to="/logout" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg" : "py-2 px-3 rounded-lg hover:bg-red-700 hover:text-white cursor-pointer duration-200"
                    }>
                    Logout
                    </NavLink>
                </li> }



            </ul>

            <div className='flex items-center justify-center gap-3'>
                
                <div>
                    <FaUser size={30}/>
                </div>

                <div className='text-left'>
                    <p>Username: {username}</p>
                    <p>ID: {userId}</p>
                </div>

            </div>

        </nav>
    )
}

export default Navbar