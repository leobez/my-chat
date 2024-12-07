import { NavLink } from 'react-router-dom'

type Props = {
    isLogged:boolean
}

const Navbar = ({isLogged}: Props) => {
    return (
        <nav className='border-2 p-2 my-4 border-black'>
            <ul className='flex gap-2 p-2'>

                { !isLogged && <li><NavLink to="/login" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-gray-300 p-2 rounded-lg" : "p-2 rounded-lg hover:bg-gray-300 cursor-pointer duration-200"
                    }>
                    To Login
                    </NavLink>
                </li> }

                { !isLogged && <li><NavLink to="/register" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-gray-300 p-2 rounded-lg" : "p-2 rounded-lg hover:bg-gray-300 cursor-pointer duration-200"
                    }>
                    To Register
                    </NavLink>
                </li> }

                { isLogged && <li><NavLink to="/" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-gray-300 p-2 rounded-lg" : "p-2 rounded-lg hover:bg-gray-300 cursor-pointer duration-200"
                    }>
                    To Home
                    </NavLink>
                </li> }

                { isLogged && <li><NavLink to="/logout" 
                    className={({ isActive, isPending }) =>
                        isPending ? "" : isActive ? "bg-gray-300 p-2 rounded-lg" : "p-2 rounded-lg hover:bg-red-700 hover:text-white cursor-pointer duration-200"
                    }>
                    Logout
                    </NavLink>
                </li> }

            </ul>
        </nav>
    )
}

export default Navbar