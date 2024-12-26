import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import NotFound from './pages/NotFound';
import Logout from './pages/auth/Logout';
import { useGetMe } from './hooks/authHooks/useGetMe';
import Navbar from './components/Navbar';
import AddFriend from './pages/AddFriend';
import TestFriendship from './pages/Test/TestFriendship';
import SocketContext, { SocketContextType } from './context/SocketContext';


function App() {

    const userId = useSelector((state:any) => state.auth.userId)
    const {connect} = useContext(SocketContext) as SocketContextType

    useEffect(() => {

      // User somehow got here wihout being logged
      if (!userId) return;

      // Initiate connection via websocket
      connect()

    }, [userId])

    return (
      <>
        <Header/>

        <BrowserRouter>

          {/* <Navbar isLogged={isLogged}/> */}

          <Routes>

            {/* ROUTE TO TEST SHIT */}
            <Route path="/" element={<TestFriendship/>}/>

            {/* 
            <Route path="/login" element={isLogged ? <Navigate to="/"/> : <Login/>}/>
            <Route path="/register" element={isLogged ? <Navigate to="/"/> : <Register/>}/>

            <Route path="/logout" element={isLogged ? <Logout/> : <Navigate to="/login"/>}/>
            <Route path="/" element={isLogged ? <Home/> : <Navigate to="/login"/>}/>
            <Route path="/add" element={isLogged ? <AddFriend/> : <Navigate to="/login"/>}/>
            <Route path='*' element={<NotFound />} /> 
            */}

          </Routes>

        </BrowserRouter>

        <Footer/>
      </>
    )
}

export default App
