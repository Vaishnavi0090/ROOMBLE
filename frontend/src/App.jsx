import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket'

function App() {
  useEffect(()=>{
    function handleConnection(){
      console.log('a user connected');
    }
    socket.on('connect', handleConnection)
  },[]);

  return (
    <div>
      Hello
    </div>
  )
}

export default App
