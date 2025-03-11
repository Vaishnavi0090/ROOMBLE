const express = require("express")
const router = express.Router();
const authMiddleware = require("../middlewares/checkuser")
const Tenant = require("../models/Tenant")
const Landlord = require("../models/Landlord")
const jwt = require("jsonwebtokem")
const dotenv = require("dotenv");
const { route } = require("./ForgotPassword")
dotenv.config();

//this code expects a response from an edit profile section wherein user can change things except for his email and password.

const SECRET_KEY = process.env.SECRET_KEY;

//update profile route 

router.put("/updateProfile",authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.id;
        const {accoutType, ...updatedFields } = req.body;
    let user;

    if(accountType === "tenant"){
        user = await Tenant.findById(userId);
    }else if(accountType === "landlord"){
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


module.exports = router;
