import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket'
import { Navbar } from './components/Navbar';
import BaseState from './context/base/Basestate.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Messages from './components/Messages';


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
    <Router>
   
      <Routes>
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Router>
    </BaseState>
  )
}

export default App
