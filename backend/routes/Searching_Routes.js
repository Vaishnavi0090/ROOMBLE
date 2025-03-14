const express = require(`express`);
const Tenant = require('../models/Tenant');
require(`dotenv`).config(`../.env`); // Load environment variables
const authMiddleware = require("../middlewares/checkuser"); 
const router = express.Router();
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

/* Search Flatmates and propeties both include here */

//Send the query as locality, gender, smoke, veg, pets, flatmates : accounttype and authtoken in header
router.get(`/SearchFlatmates`, async (req,res) => {
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

// router.get('/SearchProperties', async (req, res) => {  
//     const { town, ...filters } = req.body; // Extract town and filters from body

//     if (!town) {
//         return res.status(400).json({ error: "Town is required in the request body" });
//     }

//     try {
//         await client.connect();
//         const db = client.db("mumbai_properties");

//         // Get town data (including sorted nearest towns)
//         const townData = await db.collection("towns").findOne({ name: town });
//         if (!townData) return res.status(404).json({ error: "Town not found" });

//         // Ensure nearest_towns is an array
//         const nearestTowns = Array.isArray(townData?.nearest_towns) ? townData.nearest_towns : [];
//         const queryTowns = [town, ...nearestTowns];

//         // Construct the filter query
//         let query = { town: { $in: queryTowns } };
        
//         // Dynamically add filters based on user input
//         Object.keys(filters).forEach(key => {
//             if (filters[key] !== undefined && filters[key] !== "") {
//                 query[key] = isNaN(filters[key]) ? filters[key] : Number(filters[key]);
//             }
//         });

//         // Fetch properties with filtering
//         const properties = await db.collection("properties").find(query).toArray();

//         // Preserve sorting order based on nearest towns
//         const sortedProperties = properties.sort((a, b) => {
//             return queryTowns.indexOf(a.town) - queryTowns.indexOf(b.town);
//         });

//         res.json(sortedProperties);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     } finally {
//         await client.close();
//     }
// });

router.get('/SearchProperties', express.json(), async (req, res) => {  
    const { town, min_price, max_price, min_area, max_area, ...filters } = req.body; // Extract filters from request body

    if (!town) {
        return res.status(400).json({ error: "Town is required in the request body" });
    }

    try {
        await client.connect();
        const db = client.db("mumbai_properties");

        // Get town data (including sorted nearest towns)
        const townData = await db.collection("towns").findOne({ name: town });
        if (!townData) return res.status(404).json({ error: "Town not found" });

        // Ensure nearest_towns is an array
        const nearestTowns = Array.isArray(townData?.nearest_towns) ? townData.nearest_towns : [];
        const queryTowns = [town, ...nearestTowns];

        // Construct the filter query
        let query = { town: { $in: queryTowns } };

        // Add price range filtering
        if (min_price || max_price) {
            query.price = {};
            if (min_price) query.price.$gte = Number(min_price);
            if (max_price) query.price.$lte = Number(max_price);
        }

        // Add area range filtering
        if (min_area || max_area) {
            query.area = {};
            if (min_area) query.area.$gte = Number(min_area);
            if (max_area) query.area.$lte = Number(max_area);
        }

        // Add other dynamic filters
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== "") {
                query[key] = isNaN(filters[key]) ? filters[key] : Number(filters[key]);
            }
        });

        // Fetch properties with filtering
        const properties = await db.collection("properties").find(query).toArray();

        // Preserve sorting order based on nearest towns
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