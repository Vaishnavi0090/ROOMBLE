const express = require("express")
const router = express.Router();
const Landlord = require("../models/Landlord")
const Property = require("../models/Property")
const authMiddleware = require("../middlewares/checkuser");

router.post("/listProperty",authMiddleware, async(req,res)=>{
    try{
        const landlordId = req.user.id;
        const propertyData = req.body;

        

        const requiredFields = ["name","town","address","area","bhk","description","price","amenities"];

        const missingFields = requiredFields.filter(field => (propertyData[field] === undefined));

        if(missingFields.length>0){
            return res.status(400).json({
                success : false,
                message : `Missing Required Fields : ${missingFields.join(", ")}`
            })
        }

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
        const newProperty = new Property(propertyData);
        try{
            await newProperty.save();
        }
        catch(saveError){
            console.error("Error saving property: ",saveError);
            return res.status(500).json({
                success: false,
                message: "Failed to save the property",
            })
        }

        landlord.propertyList.push(newProperty._id);

        try{
            await landlord.save();
        }
        catch(updateError){
            console.error("Error updating landlord: ",updateError);

            await Property.findByIdAndDelete(newProperty._id);
            return res.status(500).json({
                success : false,
                message : "Failed to update landlord"
            })
        }
        return res.status(201).json({
            success : true,
            message : "Property added and listed successfully",
            property: newProperty,
        });

    } catch(error){
        console.error("Unexpected Error: ",error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
        })
    }
});

module.exports = router;