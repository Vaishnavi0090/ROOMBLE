const express = require(`express`);
const jwt = require("jsonwebtoken"); // JWT for token authentication
const bcrypt = require(`bcrypt`);
const Tenant = require("../models/Tenant");
const Landlord = require(`../models/Landlord`);
const mongoose = require(`mongoose`);
const router = express.Router();
require(`dotenv`).config(`../.env`); // Load environment variables
const authMiddleware = require("../middlewares/checkuser"); // Middleware for JWT auth

const SECRET_KEY = process.env.SECRET_KEY;

/* Contains routes for viewing Self profile and other peoples profile */

//Send just autthoken and accounttype in header and accounttype
router.post(`/Self_profile`, authMiddleware, async (req,res) => {
    try{

        let userid = req.user.id;
        let accountType = req.body.accounttype;
        let user;
        if(accountType === `tenant`){
            user = await Tenant.findById(userid);
            if(!user){
                return res.status(404).json({
                    success : false,
                    message : "Account not found"
                })
            }

            return res.status(200).json({
                success : true,
                name : user.name,
                email : user.email, 
                locality : user.locality,
                gender : user.gender,
                pets : user.pets,
                smoke : user.smoke,
                veg : user.veg,
                flatmates : user.flatmate
            })
        }
        else if(accountType === `landlord`){

        } else {
            return res.status(400).json({
                success : false,
                message : "Invalid Account Type."
            })
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Some stupid error in backend"
        })
    }
})

router.post(`/other_profiles/` , authMiddleware , async (req, res) => {
    try {
        let { requested_id, accounttype } = req.body;
        let user;
        if (!mongoose.Types.ObjectId.isValid(requested_id)) {
            console.log(`!!!!INVALID ID FOUND!!!!!`);
            console.log(id);
            return res.status(400).json({ error: `${id} is invalid ID` });
        }
        if(accounttype === `tenant`){
            user = await Tenant.findById(requested_id);
            if(!user){
                return res.status(404).json({
                    success : false,
                    message : "No such user exists."
                })
            }
            else{
                return res.status(200).json({
                    success : true,
                    name : user.name,
                    locality : user.locality,
                    gender : user.gender,
                    pets : user.pets,
                    smoke : user.smoke,
                    veg : user.veg,
                    flatmates : user.flatmate
                })
            }
        } else if(accounttype === `landlord`){

        } else {
            return res.status(400).json({
                success : false,
                message : "Invalid accounttype pls try again."
            })
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success : false,
            messsage : "Some error in server, pleaseeee try again."
        })
    }
})


module.exports = router;