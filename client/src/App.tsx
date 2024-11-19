import { useEffect, useState } from 'react';
import './App.css'
import { io } from "socket.io-client";
const socket = io();

function App() {

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    socket.on('message', (msg) => {
      console.log('msg: ', msg)
      if (messages.length === 0) {
        setMessages([msg])
      } else {
        setMessages((prev) => [...prev, msg])
      }
    });
  }, [])

  const handleSubmit = (e:any) => {
    e.preventDefault()
    console.log('chegou')
    socket.emit('message', input)
    setInput("")
  }

  return (
    <>
      <p>Hello World!</p>

      <form id="form" onSubmit={handleSubmit}>
        
        <input 
          type="text" 
          id="input" 
          value={input} 
          onChange={(e:any) => setInput(e.target.value)}
        />
        
        <button type='submit'>Send</button>
      
      </form>

      <div>
        <p>Chat messages:</p>
        <div>
          {messages.map((msg:string, index:number) => (
            <p key={index}>
              {msg}
            </p>
          ))}
        </div>
      </div>


    </>
  )
}

export default App
