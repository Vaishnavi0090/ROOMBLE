const express = require("express")
const router = express.Router();
const authMiddleware = require("../middlewares/checkuser")
const Tenant = require("../models/Tenant")
const Landlord = require("../models/Landlord")
const Property = require("../models/Property");
const mongoose = require("mongoose");
const jwt = require("jsonwebtokem")
const dotenv = require("dotenv");
// const { route } = require("./ForgotPassword")
dotenv.config();

//this code expects a response from an edit profile section wherein user can change things except for his email and password.

const SECRET_KEY = process.env.SECRET_KEY;

//update profile route 
//Send accountype and all the fields except for password in the request say like locality,smoking -> yes or no , etc.
router.put("/updateProfile",authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.id;
        const {accounttype, ...updatedFields } = req.body;
    let user;

    if(accounttype === "tenant"){
        user = await Tenant.findById(userId);
    }else if(accounttype === "landlord"){
        user = await Landlord.findById(userId);
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid Account Type"
        });
    }
    if(!user){
        return res.status(404).json({
            success:false,
            message: "User Not Found"
        })
    }

    //Not expecting email or password in updatedFields 
    Object.keys(updatedFields).forEach((key)=>{
        if(user[key] !== undefined){
            user[key] = updatedFields[key];
        }
    });
    
    //saving the user
    try{
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profle Updated Successfully"
        });
    }
    catch(error){
        console.error("Error saving updated user:",error);
        return res.status(500).json({
            success: false,
            message: "An error occurres while updating the profile. Please try again.",
            error : error.message,
        });
    }

}
catch(error){
    console.error(error);
    return res.status(500).json({
        success:false,
        message: "Internal Server Error",
    })
}});

// route for updating the attributes of the property, send the fields to be updated in the body, expect an id in the param, also authToken in the header
router.put("/updateProperty/:propertyId", authMiddleware, async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const userId = req.user.id;
        const updatedFields = req.body;

        // Validate property ID format
        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid property ID format"
            });
        }

        // Find property and check if it exists
        const property = await Property.findById(propertyId);
        
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Verify if the property belongs to the authenticated landlord
        const landlord = await Landlord.findById(userId);
        if (!landlord || !landlord.propertyList.includes(propertyId)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this property"
            });
        }

        // Remove fields that shouldn't be updated
        delete updatedFields._id;
        delete updatedFields.landlordId;
        delete updatedFields.createdAt;

        // Update only valid fields that exist in the property schema
        Object.keys(updatedFields).forEach((key) => {
            if (property[key] !== undefined) {
                property[key] = updatedFields[key];
            }
        });

        // Save the updated property
        try {
            await property.save();
            return res.status(200).json({
                success: true,
                message: "Property updated successfully",
                property: property
            });
        } catch (validationError) {
            console.error("Validation error:", validationError);
            return res.status(400).json({
                success: false,
                message: "Invalid property data",
                error: validationError.message
            });
        }

    } catch (error) {
        console.error("Error updating property:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});


module.exports = router;
