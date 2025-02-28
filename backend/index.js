const express = require('express');
const { createServer } = require('node:http');
const dotenv = require('dotenv');
dotenv.config();
const mongoconnect = require('./mongodb');
const { MongoClient } = require("mongodb");

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

app.use('/search/', require('./routes/search'));

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

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
