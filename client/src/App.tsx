import './App.css'
import { io } from "socket.io-client";
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

const SOCKET_URL = "http://localhost:3000"
const socket = io(SOCKET_URL)

socket.on('connect', () => {
  console.log(`Conectado ao servidor com ID: ${socket.id}`);
});

// Enviando uma mensagem ao servidor
socket.emit('chat message', 'Olá, servidor!');

// Recebendo mensagens do servidor
socket.on('message', (data) => {
  console.log(`Mensagem recebida do servidor: ${data}`);
});

function App() {
  return (
    <>
      <Header/>

      <BrowserRouter>

        <nav className='border-2 m-2'>
          <ul className='flex gap-2'>
            <li><Link to="login">To Login</Link></li>
            <li><Link to="register">To Register</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </BrowserRouter>

      <Footer/>
    </>
  )
}

export default App
