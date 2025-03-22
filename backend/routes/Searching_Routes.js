const express = require(`express`);
const Towns = require("../models/Towns"); // Model for town distances
const Tenant = require('../models/Tenant');
const Property = require('../models/Property');
require(`dotenv`).config(`../.env`); // Load environment variables
const authMiddleware = require("../middlewares/checkuser"); 
const router = express.Router();
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

/* Search Flatmates and propeties both include here */

//Send the query as locality, gender, smoke, veg, pets, flatmates : accounttype and authtoken in header
// router.get(`/SearchFlatmates`, async (req,res) => {
//     try{           
//         const { locality, gender, smoke, veg, pets, flatmate } = req.query;
//         let query = {};
//         if(locality !== undefined){query.locality = locality;}
//         if(gender !== undefined){query.gender = gender;}
//         if(smoke !== undefined){query.smoke = smoke;}
//         if(veg){query.veg = veg;}
//         if(pets){ query.pets = pets;}
//         if(flatmate){ query.flatmate = flatmate ;}
//         query.flatmate = true;
//         let responseToSend = await Tenant.find(query).select(`-password -_id`);

//         return res.status(200).json({
//             success : true,
//             message : `Found ${responseToSend.length} Users`,
//             data : responseToSend
//         });

//     } catch(err){
//         console.log(err);
//         return res.status(500).json({
//             succes : false,
//             message : "Some error in Server"
//         })
//     }

// })



// Searching Flatmates

//Recommendation Score Formulation

// To calculate a recommendation score between the searching tenant and potential flatmates, 
// we use a similarity function that combines:

// (i)Locality Proximity: More similar if desired localities are closer.
// (ii)Boolean Attribute Matching: More similarity if preferences (gender, smoke, veg, pets) match.


// Mathematical Approach

// Let:
// (i) 𝑑(l1,l2) be the distance between localities 
// (ii) sim(bool) be the similarity score for boolean preferences.


// Locality Similarity

// We use a function to map distances to similarity scores:
// sim(locality) = 1/(1 + d(l1,l2)), 
// where a smaller distance gives a higher score.


// Boolean Similarity

// For each boolean feature (gender, smoke, veg, pets):
// sim(bool) = matches / total boolean attributes

 
// Final Recommendation Score

// S=α⋅sim(locality) + (1−α)⋅sim(bool),
// where α is a weight factor (e.g., 0.7 for locality and 0.3 for boolean preferences).

router.get("/SearchFlatmates", authMiddleware, async (req, res) => {
    try {
        const tenant_id = req.user.id;

        let user = await Tenant.findById(tenant_id);

        if (!tenant_id) {
            return res.status(400).json({ success: false, message: "Tenant ID is required" });
        }

        // Fetch the current tenant's details
        const tenant = await Tenant.findById(tenant_id).select("-password");
        if (!tenant) {
            return res.status(404).json({ success: false, message: "Tenant not found" });
        }

        // Fetch town data for distance calculations
        const townData = await Towns.findOne({ name: tenant.locality });
        if (!townData) {
            return res.status(400).json({ success: false, message: "Invalid locality" });
        }

        // **Filter for only tenants who are actually looking for a flatmate (flatmate: true)**
        let potentialFlatmates = await Tenant.find({
            _id: { $ne: tenant_id },
            locality: { $exists: true },
            flatmate: true // **Only consider those actually looking for a flatmate**
        }).select("-password -_id");

        // Compute recommendation scores
        const alpha = 0.7; // Weight for locality importance
        let scoredResults = potentialFlatmates.map(flatmate => {
            const distance = townData.distances[flatmate.locality] || 100; // Assume 100 if unknown
            const localitySimilarity = 1 / (1 + distance);

            let booleanMatches = 0;
            if (flatmate.gender === tenant.gender) booleanMatches++;
            if (flatmate.smoke === tenant.smoke) booleanMatches++;
            if (flatmate.veg === tenant.veg) booleanMatches++;
            if (flatmate.pets === tenant.pets) booleanMatches++;

            const booleanSimilarity = booleanMatches / 4; // Normalize to [0,1]

            const score = alpha * localitySimilarity + (1 - alpha) * booleanSimilarity;



            return { ...flatmate.toObject(), recommendationScore: score , bookmarked : user.bookmarks_tenants.includes(flatmate._id)};
        });

        // Sort by score in descending order
        scoredResults.sort((a, b) => b.recommendationScore - a.recommendationScore);

        // **Extract filter parameters from the request body**
        const { locality, gender, smoke, veg, pets } = req.query;

        // Convert to Boolean only if defined
        const genderFilter = gender !== undefined ? gender === "true" : undefined;
        const smokeFilter = smoke !== undefined ? smoke === "true" : undefined;
        const vegFilter = veg !== undefined ? veg === "true" : undefined;
        const petsFilter = pets !== undefined ? pets === "true" : undefined;


        // **Filtering based on user-specified parameters (ONLY if present)**
        if (Object.keys(req.query).length > 0) {  // Apply filters only if user specified anything
            scoredResults = scoredResults.filter(flatmate => {
                if (locality !== undefined && flatmate.locality !== locality) return false;
                if (genderFilter !== undefined && flatmate.gender !== genderFilter) return false;
                if (smokeFilter !== undefined && flatmate.smoke !== smokeFilter) return false;
                if (vegFilter !== undefined && flatmate.veg !== vegFilter) return false;
                if (petsFilter !== undefined && flatmate.pets !== petsFilter) return false;
                return true;
            });
        }

        return res.status(200).json({
            success: true,
            message: `Found ${scoredResults.length} matching tenants`,
            data: scoredResults
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});


// Searching Properties

router.get('/SearchProperties', authMiddleware, async (req, res) => {  
    const { town, min_price, max_price, min_area, max_area, bhk, ...filters } = req.query; // Extract filters from request body

    if (!town) {
        return res.status(400).json({ error: "Town is required in the request body" });
    }

    try {
        // Get town data (including sorted nearest towns)
        const townData = await Towns.findOne({ name: town });
        if (!townData) return res.status(404).json({ error: "Town not found" });

        // Ensure nearest_towns is an array and extract only the first two nearest towns
        const nearestTowns = Array.isArray(townData?.nearest_towns) ? townData.nearest_towns.slice(0, 2) : [];
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

        // Handle BHK filtering
        if (bhk) {
            if (bhk === "more") {
                query.bhk = { $gt: 3 }; // More than 3 BHK
            } else {
                const bhkNumber = Number(bhk);
                if (!isNaN(bhkNumber)) query.bhk = bhkNumber; // Exact match for 1, 2, 3 BHK
            }
        }

        // Add other dynamic filters
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== "") {
                query[key] = isNaN(filters[key]) ? filters[key] : Number(filters[key]);
            }
        });

        // Fetch properties with filtering
        const properties = await Property.find(query).lean();

        // Preserve sorting order based on queryTowns
        const sortedProperties = properties.sort((a, b) => {
            return queryTowns.indexOf(a.town) - queryTowns.indexOf(b.town);
        });

        res.json(sortedProperties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;