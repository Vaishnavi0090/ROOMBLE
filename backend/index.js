const express = require('express');
const { createServer } = require('node:http');
const dotenv = require('dotenv');
const Landlord_routes_auth = require(`./routes/Landlord_auth`)//contains Landlord authentication routing
const Tenant_routes_auth = require('./routes/Tenant_auth')//COntains tenant authentication
dotenv.config(); // Load environment variables
const mongoconnect = require('./mongodb'); // Ensures MongoDB connects
const { MongoClient } = require("mongodb");

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

// Search Route
app.use('/search/', require('./routes/search'));
//Auth routes
app.use(`/authenticateLandlord`, Landlord_routes_auth);
app.use('/authenticateTenant', Tenant_routes_auth);

const client = new MongoClient(process.env.MONGOURI);

app.get("/properties/:town", async (req, res) => {
    const town = req.params.town;
    try {
      await client.connect();
      const db = client.db("mumbai_properties");
  
      // Get town data (including sorted nearest towns)
      const townData = await db.collection("towns").findOne({ name: town });
      if (!townData) return res.status(404).json({ error: "Town not found" });
  
      // Ensure nearest_towns is an array
      const nearestTowns = Array.isArray(townData?.nearest_towns) ? townData.nearest_towns : [];
      const queryTowns = [town, ...nearestTowns];
  
      // Fetch properties from all relevant towns
      const properties = await db.collection("properties").find({ town: { $in: queryTowns } }).toArray();
  
      // Sorting: Ensure properties from the main town come first
      const sortedProperties = properties.sort((a, b) => {
        return queryTowns.indexOf(a.town) - queryTowns.indexOf(b.town);
      });
  
      res.json(sortedProperties);
    } finally {
      await client.close();
    }
  });

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
