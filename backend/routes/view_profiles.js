const express = require(`express`);
const jwt = require("jsonwebtoken"); // JWT for token authentication
const bcrypt = require(`bcrypt`);
const Tenant = require("../models/Tenant");
const Landlord = require(`../models/Landlord`);
const Property = require(`../models/Property`)
const mongoose = require(`mongoose`);
const router = express.Router();
const SaveImage = require(`../helper_funcs/Saveimage`);
require(`dotenv`).config(`../.env`); // Load environment variables
const authMiddleware = require("../middlewares/checkuser"); // Middleware for JWT auth

const SECRET_KEY = process.env.SECRET_KEY;

/* Contains routes for viewing Self profile and other peoples profile */

//Send just autthoken and accounttype in header
router.post(`/Self_profile`, authMiddleware, async (req,res) => {
    try{

        let userid = req.user.id;
        let accountType = req.header(`accounttype`);
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
                id : user._id,
                name : user.name,
                email : user.email, 
                locality : user.locality,
                gender : user.gender,
                pets : user.pets,
                smoke : user.smoke,
                veg : user.veg,
                flatmates : user.flatmate,
                reviews : user.reviews,
                Images : user.Images
            })
        }
        else if(accountType === `landlord`){
            user = await Landlord.findById(userid);
            if(!user){
                return res.status(404).json({
                    success : false,
                    message : "Account not found"
                })
            }//abcdeg
            
            let properyData = [];
            for (let propid of user.propertyList){
                let prop = await Property.findById(propid);
                if(prop){
                    properyData.push(prop);
                }
            }
            console.log(properyData);
            return res.status(200).json({
                success : true,
                name : user.name,
                email : user.email,
                message : `This user owns ${properyData.length} properties.`,
                Properties : properyData,
                reviews : user.reviews,
                Images : user.Images
            })

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

router.post(`/other_users` , authMiddleware , async (req, res) => {
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
                    id : user._id,
                    name : user.name,
                    locality : user.locality,
                    gender : user.gender,
                    pets : user.pets,
                    smoke : user.smoke,
                    veg : user.veg,
                    flatmates : user.flatmate, 
                    reviews : user.reviews,
                    Images : user.Images
                })
            }
        } else if(accounttype === `landlord`){
            user = await Landlord.findById(requested_id);
            if(!user){
                return res.status(404).json({
                    success : false,
                    message : "Account not found"
                })
            }
            
            let properyData = [];
            for (let propid of user.propertyList){
                let prop = await Property.findById(propid);
                if(prop){
                    properyData.push(prop);
                }
            }

            return res.status(200).json({
                success : true,
                name : user.name,
                email : user.email,
                message : `This user owns ${properyData.length} properties.`,
                Properties : properyData, 
                reviews : user.reviews,
                Images : user.Images
            })

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