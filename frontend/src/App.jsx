import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket'
import { Navbar } from './components/Navbar';
import BaseState from './context/base/Basestate.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  useEffect(()=>{
    function handleConnection(){
      console.log('a user connected');
    }
    socket.on('connect', handleConnection)
  },[]);

  return (
    <BaseState>
      <Navbar />
    </BaseState>
  )
}

export default App
