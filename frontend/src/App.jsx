import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket'
import { Navbar } from './components/Navbar';
import BaseState from './context/base/Basestate.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Messages from './components/Messages';


function App() {
  useEffect(()=>{
    function handleConnection(){
      console.log('a user connected');
    }
    socket.on('connect', handleConnection)
    socket.emit('join', socket.id);           //TODO: send user id here
    socket.on('online_users', (data) => {
      console.log(data);
    });
    
  },[]);

  return (
    <BaseState>
     <Navbar />
      <Routes>
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </BaseState>
  )
}

export default App
