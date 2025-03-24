const express = require(`express`);
const jwt = require(`jsonwebtoken`)
const bcrypt = require(`bcrypt`);
const Landlord = require(`../models/Landlord`);
const Tenant = require(`../models/Tenant`);
const checkUser = require("../middlewares/checkuser");

const router = express.Router();
require(`dotenv`).config(`../.env`); // Load environment variables

const SECRET_KEY = process.env.SECRET_KEY;

router.post('/user', checkUser, async (req, res) => {
    try {
        const user = req.user;
        res.json({ user, success: true });
    } catch (err) {
        // console.log(err);
        res.json({ success: false });
    }
})

module.exports = router;