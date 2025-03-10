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

module.exports = router;