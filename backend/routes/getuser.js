const express = require(`express`);
const jwt = require(`jsonwebtoken`)
const bcrypt = require(`bcrypt`);
const Landlord = require(`../models/Landlord`);
const Tenant = require(`../models/Tenant`);

const router = express.Router();
require(`dotenv`).config(`../.env`); // Load environment variables

const SECRET_KEY = process.env.SECRET_KEY;

router.post('/user', async (req, res) => {
    const authtoken = req.header("authtoken");
    // console.log(authtoken);
    if (!authtoken) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(authtoken, SECRET_KEY);
        const id = decoded.id;

        //find user by id
        const user = await Tenant.findById(id);
        if (user) {
            return res.status(200).json({ success: true, user: user });
        }
        const landlord = await Landlord.findById(id);
        if (landlord) {
            return res.status(200).json({ success: true, user: landlord });
        }
        return res.status(400).json({ success: false, message: "User not found" });
    } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid token" });
    }
});

module.exports = router;