const express = require('express');
const { createServer } = require('node:http');
const dotenv = require('dotenv');
dotenv.config();
const path = require('node:path');
const { Server } = require('socket.io');
const mongoconnect = require('./mongodb');
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
app.use(express.json());

const Landlord = require('./models/Landlord');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/auth',require('./routes/auth'));

io.on('connection', (socket) => {
  console.log('a user connected');
});
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});