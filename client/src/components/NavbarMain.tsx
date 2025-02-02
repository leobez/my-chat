import { NavLink } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { useLogout } from '../hooks/authHooks/useLogout';
import { MdLogin } from "react-icons/md";
import { MdAccountBox } from "react-icons/md";

type Props = {
    isLogged:boolean
}

const NavbarMain = ({isLogged}: Props) => {

    const {logout} = useLogout()

    return (
        <nav className='flex h-full'>
            <ul className='flex flex-col gap-5 w-full'>

                
                { isLogged && <li><NavLink to="/" 
                    className={({ isActive }) =>
                        isActive ? "font-bold p-4 w-full flex gap-2 bg-white text-blue-800 rounded-lg items-center" 
                        : 
                        "font-bold p-4 w-full flex gap-2 bg-blue-800 text-white hover:bg-white hover:text-blue-800 rounded-lg hover:border-white duration-300 items-center"
                    }>
                    <FaHome size={20}/>
                    Principal
                    </NavLink>
                </li> }

                { isLogged && <li><NavLink to={`/profile`} 
                    className={({ isActive }) =>
                        isActive ? "font-bold p-4 w-full flex gap-2 bg-white text-blue-800 rounded-lg items-center" 
                        : 
                        "font-bold p-4 w-full flex gap-2 bg-blue-800 text-white hover:bg-white hover:text-blue-800 rounded-lg hover:border-white duration-300 items-center"
                    }>
                    <FaUser size={20}/>
                    Meu perfil
                    </NavLink>
                </li> }

                { isLogged && <li><NavLink to="/add" 
                    className={({ isActive }) =>
                        isActive ? "font-bold p-4 w-full flex gap-2 bg-white text-blue-800 rounded-lg items-center" 
                        : 
                        "font-bold p-4 w-full flex gap-2 bg-blue-800 text-white hover:bg-white hover:text-blue-800 rounded-lg hover:border-white duration-300 items-center"
                    }>
                    <FaUserFriends size={20}/>
                    Adicione um amigo
                    </NavLink>
                </li> }
                
                {/* { isLogged && <li><NavLink to="/join" 
                    className={({ isActive }) =>
                        isActive ? "font-bold p-4 w-full flex gap-2 bg-white text-blue-800 rounded-lg items-center" 
                        : 
                        "font-bold p-4 w-full flex gap-2 bg-blue-800 text-white hover:bg-white hover:text-blue-800 rounded-lg hover:border-white duration-300 items-center"
                    }>
                    <TiGroup size={20}/>
                    Entre em um grupo
                    </NavLink>
                </li> } */}

                { isLogged && <li>
                    <button onClick={() => logout()} className='font-bold p-4 w-full flex gap-2 text-blue-800 bg-white hover:bg-red-900 hover:text-white rounded-lg duration-300 items-center'>
                        <MdLogout size={25}/>
                        Sair
                    </button>
                </li> }



            </ul>
        </nav>
    )
}

export default NavbarMain