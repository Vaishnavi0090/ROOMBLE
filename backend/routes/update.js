const express = require("express")
const router = express.Router();
const Landlord = require("../models/Landlord");
const Property = require("../models/Property");
const path = require(`path`);
const fs = require(`fs`);
const moveImage = require(`../helper_funcs/Saveimage`);//async fucntion which helps upload images
const authMiddleware = require("../middlewares/checkuser");
require(`dotenv`).config(`../.env`);
const SaveImage = require(`../helper_funcs/Saveimage`);


// const { route } = require("./ForgotPassword")

//this code expects a response from an edit profile section wherein user can change things except for his email and password.

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT;
const MAX_ALLOWED_PICS = 10;
const maxSize = 2 * 1024 * 1024; // Maximum allowed size : 2mb
const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

//update profile route 
//Send accountype and all the fields except for password in the request say like locality,smoking -> yes or no , etc.
//Upload picture in req.files.image max size 2mb
router.put("/updateProfile", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        //if you want to remove profile pic, then pass , remove : "profilepic"
        const { accounttype, remove, ...updatedFields } = req.body; let user;

        if (accounttype === "tenant") {
            user = await Tenant.findById(userId);
        } else if (accounttype === "landlord") {
            user = await Landlord.findById(userId);
        }
        else {
            console.log(`Accountype : ${accounttype}`);
            return res.status(400).json({
                success: false,
                message: "Invalid Account Type"
            });
        }

        //

        //The frontend guys had difficulty in sending gender, so I added this line
        if (updatedFields.gender === undefined) {
            updatedFields.gender = user.gender;
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        if (req.files && req.files.image) {
            // console.log('in here'); //FOR Debugging
            let image = req.files.image;
            if (image.size > maxSize) {
                return res.status(400).json({
                    success: false,
                    message: `Image size is ${image.size} but maximum allowed is only ${maxSize}`
                })
            } else if (!allowedExtensions.test(image.name)) {
                return res.status(400).json({
                    success: false,
                    message: `Only png, jpg and jpeg allowed in image.`
                })
            }
            else {
                //Save the image into Pictures/accounttype
                let UploadPath = path.join(__dirname, `../Pictures`, `${accounttype}`, `${user.id}${path.extname(image.name).toLowerCase()}`);
                await SaveImage(image, UploadPath);
                user.Images = `http://127.0.0.1:3000/Pictures/${accounttype}/${user.id}${path.extname(image.name).toLowerCase()}`;

            }
        }

        //Not expecting email or password in updatedFields 
        Object.keys(updatedFields).forEach((key) => {
            if (user[key] !== undefined) {
                user[key] = updatedFields[key];
            }
        });


        //Testing of remove is left
        if (remove === `profilepic`) {
            user.Images = `http://127.0.0.1:3000/Pictures/Default.png`;
        }

        //saving the user
        try {
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Profle Updated Successfully"
            });
        }
        catch (error) {
            console.error("Error saving updated user:", error);
            return res.status(500).json({
                success: false,
                message: "An error occurres while updating the profile. Please try again.",
                error: error.message,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
});

// route for updating the attributes of the property, send the fields to be updated in the body, expect an id in the param, also authToken in the header
router.post("/updateProperty/", authMiddleware, async (req, res) => {
    try {

        const propertyData = req.body;
        const landlordId = req.user.id;
        const propertyId = req.body.id;

        const requiredFields = ["city", "town", "address", "area", "bhk", "description", "price", "amenities"];

        const missingFields = requiredFields.filter(field => (propertyData[field] === undefined));

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing Required Fields : ${missingFields.join(", ")}`
            })
        }

        // console.log(req.user.propertyList.includes(propertyId))

        if (!req.user.propertyList.includes(propertyId)) {
            return res.status(400).json({
                success: false,
                message: "You do not own this property"
            })
        }

        let property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            })
        }

        property.description = req.body.description;
        property.city = req.body.city;
        property.town = req.body.town;
        property.address = req.body.address;
        property.area = req.body.area;
        property.bhk = req.body.bhk;
        property.price = req.body.price;
        property.amenities = req.body.amenities;

        console.log(req.files);
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                message: "Kindly upload photos as well"
            })
        }


        //convert the images into an array
        if (!Array.isArray(req.files.image)) {
            req.files.image = [req.files.image];
        }

        //empty current images from the property directory
        // clear /Pictures/property/propertyId
        const propertyDir = path.join(__dirname, `../Pictures`, `property`, `${propertyId}`);
        fs.rmdirSync(propertyDir, { recursive: true });
        property.Images = [];

        //make a new directory for each property
        let imageData = req.files.image;
        fs.mkdirSync(propertyDir);

        if (imageData.length > MAX_ALLOWED_PICS) {
            return res.status(400).json({
                success: false,
                message: `Maximum allowed images are ${MAX_ALLOWED_PICS}`
            })
        }

        let Image_count = 0;
        for (let image of imageData) {
            if (image.size > maxSize) {
                return res.json(400).json({
                    success: false,
                    message: `Image size is ${image.size} but maximum allowed is only ${maxSize}`
                })
            } else if (!allowedExtensions.test(image.name)) {
                return res.status(400).json({
                    success: false,
                    message: `Only png, jpg and jpeg allowed in image.`
                })
            } else {
                //Save the image into Pictures/accounttype
                let UploadPath = path.join(__dirname, `../Pictures`, `property`, `${property.id}`, `${Image_count}${path.extname(image.name).toLowerCase()}`);
                await moveImage(image, UploadPath);
                property.Images.push(`http://127.0.0.1:${PORT}/Pictures/property/${property.id}/${Image_count}${path.extname(image.name).toLowerCase()}`);
                Image_count++;
            }
        }

        await property.save();
        return res.status(200).json({
            success: true,
            message: "Property Updated Successfully"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }



});


module.exports = router;
