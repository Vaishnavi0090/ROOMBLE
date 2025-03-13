const express = require(`express`);
const Tenant = require('../models/Tenant');
require(`dotenv`).config(`../.env`); // Load environment variables
const authMiddleware = require("../middlewares/checkuser"); 
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

/* Search Flatmates and propeties both include here */

//Send the query as locality, gender, smoke, veg, pets, flatmates : accounttype and authtoken in header
router.get(`/SearchFlatmates`, authMiddleware, async (req,res) => {
    try{           
        const { locality, gender, smoke, veg, pets, flatmate } = req.body;
        let query = {};
        if(locality !== undefined){query.locality = locality;}
        if(gender !== undefined){query.gender = gender;}
        if(smoke !== undefined){query.smoke = smoke;}
        if(veg){query.veg = veg;}
        if(pets){ query.pets = pets;}
        if(flatmate){ query.flatmate = flatmate ;}
        query.flatmate = true;
        let responseToSend = await Tenant.find(query).select(`-password -_id`);

        return res.status(200).json({
            success : true,
            message : `Found ${responseToSend.length} Users`,
            data : responseToSend
        });

    } catch(err){
        console.log(err);
        return res.status(500).json({
            succes : false,
            message : "Some error in Server"
        })
    }

})

const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGOURI);

/* Search Properties */
// Will add authMiddleware too in the next line, disabled it for testing purposes
router.get('/SearchProperties/:town', async (req, res) => {  
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await client.close();
    }
});

module.exports = router;