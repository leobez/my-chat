import './App.css'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useGetMe } from './hooks/authHooks/useGetMe';

// COMPONENTS
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import Header from './components/Header';
import Footer from './components/Footer';

// PAGES
import AddFriend from './pages/AddFriend';
import NotFound from './pages/NotFound';
import Logout from './pages/auth/Logout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import SnackBar from './components/Snackbar';

function App() {

    const {me, loading} = useGetMe()

    const userId = useSelector((state:any) => state.auth.userId)

    // Verify if user is logged in
    useEffect(() => {
      me()
    }, [])

    if (loading) {
      return (
        <>
          <Loading/>
        </>
      )
    }

    return (
      <>
        <Header/>

        <BrowserRouter>

          <Navbar isLogged={userId ? true : false}/>
          <SnackBar/>

          <Routes>

            {/* UNPROTECTED ROUTES */}
            <Route path="/login" element={userId ? <Navigate to="/"/> : <Login/>}/>
            <Route path="/register" element={userId ? <Navigate to="/"/> : <Register/>}/>

            {/* PROTECTED ROUTES */}
            <Route path="/logout" element={userId ? <Logout/> : <Navigate to="/login"/>}/>
            <Route path="/add" element={userId ? <AddFriend/> : <Navigate to="/login"/>}/>
            <Route path="/" element={userId ? <Home/> : <Navigate to="/login"/>}/>
            <Route path='*' element={<NotFound />} /> 

          </Routes>

        </BrowserRouter>

        <Footer/>
      </>
    )
}

export default App
