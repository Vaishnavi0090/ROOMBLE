const express = require('express');
const { createServer } = require('node:http');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables
const mongoconnect = require('./mongodb'); // Ensures MongoDB connects

const app = express();
const server = createServer(app);

// Import database connection
require('./mongodb'); // Ensures MongoDB connects

// Import the socket setup function
const setupSocket = require('./socket');
const io = setupSocket(server);

// Middleware
app.use(express.json()); // Allows Express to parse JSON request bodies

// Import models
const Landlord = require('./models/Landlord');
const Tenant = require('./models/Tenant'); // Added Tenant model

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reviews', require('./routes/reviewroutes')); // Added Review Routes

// Default Route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
