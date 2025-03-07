import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket'
import { Navbar } from './components/Navbar';
import BaseState from './context/base/Basestate.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Messages from './components/Messages';
import SignUpPage from './components/SignUp';
import Login from './components/Login.jsx';
import AddProperty from './components/AddProperty.jsx';
import FindProperty from './components/FindProperty.jsx';
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
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-property" element={<AddProperty/>}/>
        <Route path="/find-property" element={<FindProperty/>} />
      </Routes>
      
    </BaseState>
  )
}

export default App
