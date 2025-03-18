const express = require("express");
const router = express.Router();
const Landlord = require("../models/Landlord");
const Property = require("../models/Property");
const authMiddleware = require("../middlewares/checkuser");



// authtoken,accounttyep in header, and property id in the call
router.delete("/deleteProperty/:propertyId", authMiddleware, async (req, res) => {
    try {
        const landlordId = req.user.id;
        const propertyId = req.params.propertyId;

        const landlord = await Landlord.findById(landlordId);
        if (!landlord) {
            return res.status(404).json({
                success: false,
                message: "Landlord not found",
            });
        }

        if (!landlord.propertyList.includes(propertyId)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this property",
            });
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        await Property.findByIdAndDelete(propertyId);
        landlord.propertyList = landlord.propertyList.filter(id => id.toString() !== propertyId);
        await landlord.save();

        return res.status(200).json({
            success: true,
            message: "Property deleted successfully",
        });
    } catch (error) {
        console.error("Unexpected Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

module.exports = router;
