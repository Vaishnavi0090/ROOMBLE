import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket'
import { use } from 'react';

function App() {
  useEffect(()=>{
    function handleConnection(){
      console.log('a user connected');
    }
    socket.on('connect', handleConnection)
  },[]);

  //make a function to handle the connection event
  //useEffect to listen to the connection event
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
