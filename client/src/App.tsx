import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import NotFound from './pages/NotFound';
import Logout from './pages/Logout';
import Chat from './pages/Chat';
import { useGetMe } from './hooks/useGetMe';


function App() {

    const [loadingTestLogin, setLoadingTestLogin] = useState(true)

    const {me} = useGetMe()

    // Verify user auth status (auto login user)
    useEffect(() => {
      const testAuthAsync = async() => {
        await me()
        setLoadingTestLogin(false)
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
            <Route path="/logout" element={isLogged ? <Logout/> : <Navigate to="/login"/>}/>
            <Route path="/chat/:id" element={isLogged ? <Chat/> : <Navigate to="/login"/>}></Route>
            <Route path="/" element={isLogged ? <Home/> : <Navigate to="/login"/>}/>
            <Route path='*' element={<NotFound />} />
          </Routes>

        </BrowserRouter>

        <Footer/>
      </>
    )
}

export default App
