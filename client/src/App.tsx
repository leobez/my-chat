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
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import SnackBar from './components/SnackBar';
import Profile from './pages/Profile';

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
      <div className='h-screen w-full'>

        <div className='flex flex-col w-full h-full bg-white'>

          <BrowserRouter>

            <div className='bg-blue-950 w-full'>
              <div className='max-w-7xl w-full mx-auto px-3 py-6 flex justify-between'>
                <header>
                  <Header/>
                </header>
                <div>
                  <Navbar isLogged={userId ? true : false}/>
                </div>
              </div>
            </div>

            <SnackBar/>

            <main className='flex-1 bg-blue-600'>
              <div className='max-w-7xl w-full h-full mx-auto'>
                <Routes>
                    {/* UNPROTECTED ROUTES */}
                    <Route path="/login" element={userId ? <Navigate to="/"/> : <Login/>}/>
                    <Route path="/register" element={userId ? <Navigate to="/"/> : <Register/>}/>

                    {/* PROTECTED ROUTES */}
                    <Route path="/add" element={userId ? <AddFriend/> : <Navigate to="/login"/>}/>
                    <Route path="/profile" element={userId ? <Profile/> : <Navigate to="/login"/>}/>
                    <Route path="/" element={userId ? <Home/> : <Navigate to="/login"/>}/>
                    <Route path='*' element={<NotFound />} /> 
                </Routes>
              </div>
            </main>

            <div className='bg-blue-950 w-full'>
              <div className='max-w-7xl w-full mx-auto px-3 py-6'>
                <footer className='h-fit'>
                  <Footer/>
                </footer>
              </div>
            </div>

          </BrowserRouter>

        </div>

      </div>
    )
}

export default App
