const express = require('express');
const { createServer } = require('node:http');
const dotenv = require('dotenv');
dotenv.config();
const mongoconnect = require('./mongodb');

const app = express();
const server = createServer(app);

// Import the socket setup function
const setupSocket = require('./socket');
const io = setupSocket(server);

app.use(express.json());

const Landlord = require('./models/Landlord');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/auth', require('./routes/auth'));

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
