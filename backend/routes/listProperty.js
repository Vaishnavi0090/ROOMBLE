const express = require("express")
const router = express.Router();
const Laandlord = require("../models/Landlord")
const Property = require("../models/Property")
const authMiddleware = require("../middlewares/checkuser");
const Landlord = require("../models/Landlord");

router.post("/listProperty",authMiddleware, async(req,res)=>{
    try{
        const landlordId = req.user.id;
        const propertyData = req.body;


        const landlord = await Landlord.findById(landlordId);
        if(!landlord){
            return res.status(404).json({
                success : false,
                message: "Landlord not found",
            })
        }

        const property = await Property.findOne({
        address : propertyData.address, _id:{ $in: landlord.propertyList}
        });

        if(property){
            return res.status(400).json({
                success : false,
                message : "You have already listed a property at this address"
            });
        }
    }
})