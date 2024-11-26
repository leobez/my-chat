import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import NotFound from './pages/NotFound';
import Logout from './pages/Logout';
import { loginReducer } from './slices/authSlice';

const API_URL = "http://localhost:3000/api/user"

function App() {

  const dispatch = useDispatch()
  const [loadingTestLogin, setLoadingTestLogin] = useState(true)

  // Verify user auth status (auto login user)
  useEffect(() => {
    
    const testAuthAsync = async() => {
      try {

        const response = await fetch(`${API_URL}/me`, {method: 'GET', credentials: 'include'})
        const data =  await response.json()

        // Resonse code not between 200 - 299
        if (!response.ok) {
          console.log('All details: ', data.details) // REMOVE LATER
          console.log('Error Message: ', data.message) // REMOVE LATER
        }

        // JWT sent by user is correct, therefore is user is already logged in
        if (data.loggedIn) {
          if (data.data)
          dispatch(loginReducer({
            email: data.data.email,
            username: data.data.username
          }))
        }

        setLoadingTestLogin(false)

      } catch (error) {
        console.log(error)
        setLoadingTestLogin(false)
      }
    }
    testAuthAsync()

  }, [])

  const isLogged = useSelector((state:any) => state.auth.isLoggedIn)

  if (loadingTestLogin) {
    return;
  }

  return (
    <>
      <Header/>

      <BrowserRouter>

        <nav className='border-2 m-2'>
          <ul className='flex gap-2'>
            { !isLogged && <li><Link to="/login">To Login</Link></li> }
            { !isLogged && <li><Link to="/register">To Register</Link></li> }
            { isLogged && <li><Link to="/">To Home</Link></li> }
            { isLogged && <li><Link to="/logout">Logout</Link></li> }
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={isLogged ? <Navigate to="/"/> : <Login/>}/>
          <Route path="/register" element={isLogged ? <Navigate to="/"/> : <Register/>}/>
          <Route path="/" element={isLogged ? <Home/> : <Navigate to="/login"/>}/>
          <Route path="/logout" element={isLogged ? <Logout/> : <Navigate to="/login"/>}/>
          <Route path='*' element={<NotFound />} />
        </Routes>

      </BrowserRouter>

      <Footer/>
    </>
  )
}

export default App
