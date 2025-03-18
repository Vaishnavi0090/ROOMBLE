const express = require("express");
const router = express.Router();
const Landlord = require("../models/Landlord");
const Property = require("../models/Property");
const mongoose = require(`mongoose`)
const authMiddleware = require("../middlewares/checkuser");

//Send authtoken, accounttype in header and property_id, action in body . action can be 'enlist' or 'delist'
router.post(`/List_Delist_Prop`, authMiddleware, async (req, res) => {
    try{
        const action = req.body.action;
        const list_id = req.body.property_id;
        const user_id = req.user.id;

        if(action !== 'enlist' && action !== 'delist'){
            return res.status(400).json({
                success : false,
                message : "action can be only enlist or delust"            
            })
        }
        
        if(!mongoose.isValidObjectId(list_id)){
            return res.status(400).json({
                success : false,
                message : "Invalid ID format"
            })
        }

        let user_landlord = await Landlord.findById(user_id);

        if(user_landlord.propertyList.includes(list_id)){
            let prop = await Property.findById(list_id);
            if(!prop){
                console.log(`${user_id} has ${list_id} but it doesnt exist in database`);
                return res.status(500).json({
                    success : false,
                    message : "Some internal error in server"
                })
            }
            prop.available = (action === "enlist");
            await prop.save()
            return res.status(200).json({
                success : true,
                message : `Successfulle ${action}ed property`
            })
        } else {
            return res.status(401).json({
                success : false,
                message : "Please keep your hands to your properties."
            })
        }
    } catch (e){
        console.log(`Error while listing/Delisting property`);
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Sorry, some internal server error occured, please write to roomble360@gmail.com"
        })
    }
})



module.exports = router