import { NavLink } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { useLogout } from '../hooks/authHooks/useLogout';

type Props = {
    isLogged:boolean
}

const Navbar = ({isLogged}: Props) => {

    const {logout} = useLogout()

    return (
        <nav className='border-2 p-2 mt-1 border-black flex justify-between rounded-lg'>

            <ul className='flex gap-2 p-2'>

                { !isLogged && <li><NavLink to="/login" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg w-fit flex gap-2 items-center justify-center" : "py-2 px-3 rounded-lg hover:bg-black hover:text-white cursor-pointer duration-200 w-fit flex gap-2 items-center justify-center"
                    }>
                    Login
                    </NavLink>
                </li> }

                { !isLogged && <li><NavLink to="/register" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg w-fit flex gap-2 items-center justify-center" : "py-2 px-3 rounded-lg hover:bg-black hover:text-white cursor-pointer duration-200 w-fit flex gap-2 items-center justify-center"
                    }>
                    Register
                    </NavLink>
                </li> }

                { isLogged && <li><NavLink to="/" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg w-fit flex gap-2 items-center justify-center" : "w-fit flex gap-2 items-center justify-center py-2 px-3 rounded-lg hover:bg-black hover:text-white cursor-pointer duration-200"
                    }>
                    <FaHome size={20}/>
                    Home
                    </NavLink>
                </li> }

                { isLogged && <li><NavLink to={`/profile`} 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg w-fit flex gap-2 items-center justify-center" : "w-fit flex gap-2 items-center justify-center py-2 px-3 rounded-lg hover:bg-black hover:text-white cursor-pointer duration-200"
                    }>
                    <FaUser size={20}/>
                    Profile
                    </NavLink>
                </li> }

                { isLogged && <li><NavLink to="/add" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg w-fit flex gap-2 items-center justify-center" : "w-fit flex gap-2 items-center justify-center py-2 px-3 rounded-lg hover:bg-black hover:text-white cursor-pointer duration-200"
                    }>
                    <FaUserFriends size={20}/>
                    Add a friend
                    </NavLink>
                </li> }
                
                { isLogged && <li><NavLink to="/join" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-black text-white py-2 px-3 rounded-lg w-fit flex gap-2 items-center justify-center" : "w-fit flex gap-2 items-center justify-center py-2 px-3 rounded-lg hover:bg-black hover:text-white cursor-pointer duration-200"
                    }>
                    <TiGroup size={20}/>
                    Join a group
                    </NavLink>
                </li> }

                { isLogged && <li>
                    <button onClick={() => logout()} className='bg-white text-black hover:bg-red-600 hover:text-white duration-300 py-2 px-3 rounded-lg w-fit flex gap-2 items-center justify-center'>
                        <MdLogout size={20}/>
                        Logout
                    </button>
                </li> }



            </ul>

        </nav>
    )
}

export default Navbar