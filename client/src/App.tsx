import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import NotFound from './pages/NotFound';
import Logout from './pages/auth/Logout';
import { useGetMe } from './hooks/userHooks/auth/useGetMe';
import Navbar from './components/Navbar';
import AddFriend from './pages/AddFriend';


function App() {

    const {me, loading} = useGetMe()

    // Verify user auth status (auto login user)
    useEffect(() => {
      const testAuthAsync = async() => {
        await me()
      }
      testAuthAsync()
    }, [])

    const isLogged = useSelector((state:any) => state.auth.isLoggedIn)

    if (loading) {
      return;
    }

    return (
      <>
        <Header/>

        <BrowserRouter>

          <Navbar isLogged={isLogged}/>

          <Routes>

            {/* MUST NOT BE LOGGED TO ACCESS */}
            <Route path="/login" element={isLogged ? <Navigate to="/"/> : <Login/>}/>
            <Route path="/register" element={isLogged ? <Navigate to="/"/> : <Register/>}/>

            {/* MUST BE LOGGED TO ACCESS */}
            <Route path="/logout" element={isLogged ? <Logout/> : <Navigate to="/login"/>}/>
            <Route path="/" element={isLogged ? <Home/> : <Navigate to="/login"/>}/>
            <Route path="/add" element={isLogged ? <AddFriend/> : <Navigate to="/login"/>}/>

            {/* WHATEVER */}
            <Route path='*' element={<NotFound />} />

          </Routes>

        </BrowserRouter>

        <Footer/>
      </>
    )
}

export default App
