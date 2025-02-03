const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');
const Landlord = require('../models/Landlord');


//Login Tenant

//Login Landlord
router.get('/login', async (req, res) => {
    console.log("came");
    res.send("Hello");
})
//Sign Up Tenant

//Sign Up Landlord


module.exports = router;