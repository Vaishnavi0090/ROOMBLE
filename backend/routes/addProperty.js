const express = require("express")
const router = express.Router();
const Landlord = require("../models/Landlord");
const Property = require("../models/Property");
const path = require(`path`);
const fs = require(`fs`);
const authMiddleware = require("../middlewares/checkuser");
require(`dotenv`).config(`../.env`);

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT;

const MAX_ALLOWED_PICS = 10;
const maxSize = 2*1024*1024; // Maximum allowed size : 2mb
const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;



function moveImage(image, UploadPath) {
    return new Promise((resolve, reject) => {
        image.mv(UploadPath, (err) => {
            if (err) {
                console.log("Error uploading image while updating");
                console.log(err);
                reject({
                    success: false,
                    message: "Some internal server error, in uploading the picture."
                });
            } else {
                resolve();
            }
        });
    });
}



router.post("/listProperty",authMiddleware, async(req,res)=>{
    try{
        const landlordId = req.user.id;
        const propertyData = req.body;
        // city: 
        // town: 
        // address: 
        // area: 
        // bhk: 
        // description: 
        // amenities:
        // price:
        // available : 
        // Images :

        const requiredFields = ["city","town","address","area","bhk","description","price","amenities"];

        const missingFields = requiredFields.filter(field => (propertyData[field] === undefined));

        if(missingFields.length>0){
            return res.status(400).json({
                success : false,
                message : `Missing Required Fields : ${missingFields.join(", ")}`
            })
        }

        let landlord = await Landlord.findById(landlordId);
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


        let newProperty = new Property(propertyData);

        if(!req.files || !req.files.image){
            return res.status(400).json({
                success : false,
                message : "Kindly upload photos as well"
            })
        }
        
        let imageData = req.files.image;
        fs.mkdirSync(path.join(__dirname , `../Pictures` , `property` ,`${newProperty.id}`));

        if(imageData.size > MAX_ALLOWED_PICS){
            return res.status(400).json({
                success : false,
                message : `More than ${MAX_ALLOWED_PICS} uploaded, there isn't space in database`
            })
        }
        let Image_count = 0;
        for(let image of imageData){
            if(image.size > maxSize){
                return res.json(400).json({
                    success : false,
                    message : `Image size is ${image.size} but maximum allowed is only ${maxSize}`
                })
            } else if(!allowedExtensions.test(image.name)) {
                return res.status(400).json({
                    success : false,
                    message : `Only png, jpg and jpeg allowed in image.`
                })
            } else{
                //Save the image into Pictures/accounttype
                let UploadPath = path.join(__dirname , `../Pictures` , `property`, `${newProperty.id}` , `${Image_count}${path.extname(image.name).toLowerCase()}`);
                await moveImage(image, UploadPath);
                newProperty.Images.push(`http://127.0.0.1:${PORT}/Pictures/property/${newProperty.id}/${Image_count}${path.extname(image.name).toLowerCase()}`);
                Image_count++;
            }
        }

        console.log(`hi fucher`);
        try{
            console.log(`saving property`);
            console.log(newProperty);
            console.log(newProperty.Images);
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