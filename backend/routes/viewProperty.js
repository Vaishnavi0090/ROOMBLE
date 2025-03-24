const express = require(`express`);
require(`dotenv`).config(`../.env`); // Load environment variables
const authMiddleware = require("../middlewares/checkuser"); // Middleware for JWT auth
const Property = require(`../models/Property`)
const SECRET_KEY = process.env.SECRET_KEY;

const router = express.Router();

router.post('/get_property', async (req, res) => {
    try {
        const property_id = req.body.id;
        const property = await Property.findById(property_id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }
        return res.status(200).json({
            success: true,
            property: property
        });
    } catch (e) {
        // console.log(e);
        return res.status(500).json({
            success: false,
            message: "Some internal Server error :( Please try again.",
        });
    }
})

module.exports = router;