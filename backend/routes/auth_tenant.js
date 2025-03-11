const express = require(`express`);
const jwt = require("jsonwebtoken"); // JWT for token authentication
const bcrypt = require(`bcrypt`);
const Tenant = require(`../models/Tenant_models`);
const { Landlord_OTP, Tenant_OTP } = require(`../models/OTP_models`);
const router = express.Router();
const Sendmail = require(`../helper_funcs/mailSender`);
const authMiddleware = require("../middleware/auth-middleware"); // Middleware for JWT auth

const SECRET_KEY = "your_secret_key"; // Change this to a secure secret key

/* Contains authenticate/Tenant_Login, authenticate/Tenant_register, authenticate/verifyTenant */

async function Hashpassword(plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}

async function ComparePassword(enteredPassword, storedHash) {
    return await bcrypt.compare(enteredPassword, storedHash);
}

// --------------------- Tenant Registration ---------------------
router.post(`/Tenant_register`, async (req, res) => {
    try {
        const { name, email, password, locality, gender, religion, alcohol, veg, pets } = req.body;
        const checkExistingUser = await Tenant.findOne({ email });

        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: `A user already exists with the given credentials`,
                status: `400`
            });
        }

        // If user already requested OTP, update OTP instead of creating a new entry
        const checkExistingUser_withOTP = await Tenant_OTP.findOne({ email });
        if (checkExistingUser_withOTP) {
            let new_OTP = (Math.floor(100000 + Math.random() * 900000)).toString();
            await Sendmail(email, `Welcome once again to Roomble`, new_OTP);
            await checkExistingUser_withOTP.updateOne({ OTP: new_OTP });

            return res.json({ message: "New OTP sent" });
        }

        let hashedPassword = await Hashpassword(password);
        let generated_OTP = (Math.floor(100000 + Math.random() * 900000)).toString();

        const newlyCreatedUser = new Tenant_OTP({
            name,
            email,
            password: hashedPassword,
            OTP: generated_OTP,
            locality,
            religion,
            alcohol,
            pets,
            veg,
            gender
        });

        await newlyCreatedUser.save();

        if (newlyCreatedUser) {
            await Sendmail(email, `Welcome to Roomble!!`, `Your OTP is ${generated_OTP}`);
            res.redirect(`authenticate/verifyTenant/${newlyCreatedUser._id}`);
        } else {
            res.status(400).json({
                success: false,
                message: "Unable to register user! Please try again."
            });
        }
    } catch (e) {
        console.error(`Error occurred`, e);
        res.status(500).json({
            message: "Some error in server",
            success: false
        });
    }
});

// --------------------- OTP Verification & Tenant Creation ---------------------
router.post(`/verifyTenant/:id`, async (req, res) => {
    try {
        const { Entered_OTP } = req.body;
        const userId = req.params.id;

        if (!userId) {
            return res.json({ message: "OTP isn't generated, Try again" });
        }

        const Tenant_withOTP = await Tenant_OTP.findById(userId);

        if (!Tenant_withOTP) {
            return res.status(404).json({
                success: false,
                message: "Your session has expired"
            });
        }

        if (Entered_OTP === Tenant_withOTP.OTP) {
            const newTenant = new Tenant({
                name: Tenant_withOTP.name,
                email: Tenant_withOTP.email,
                password: Tenant_withOTP.password,
                locality: Tenant_withOTP.locality,
                gender: Tenant_withOTP.gender,
                religion: Tenant_withOTP.religion,
                alcohol: Tenant_withOTP.alcohol,
                veg: Tenant_withOTP.veg,
                pets: Tenant_withOTP.pets
            });

            await newTenant.save();

            res.status(201).json({
                success: true,
                message: "User successfully registered"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid OTP, please try again"
            });
        }
    } catch (e) {
        console.error(`Error occurred`, e);
        res.status(500).json({
            success: false,
            message: "Some error in server"
        });
    }
});

// --------------------- Tenant Login with JWT Token ---------------------
router.post(`/Tenant_login`, async (req, res) => {
    try {
        const { email, password } = req.body;
        const findTenant = await Tenant.findOne({ email });

        if (!findTenant) {
            return res.status(404).json({
                success: false,
                message: "No user exists.",
                status: "404"
            });
        }

        let result = await ComparePassword(password, findTenant.password);

        if (result) {
            // Generate JWT token
            const token = jwt.sign({ id: findTenant._id, email: findTenant.email }, SECRET_KEY, { expiresIn: "1h" });

            res.status(200).json({
                success: true,
                name: findTenant.name,
                message: "Successful Login",
                token  // Returning the token
            });
        } else {
            res.status(401).json({
                status: "401",
                message: "Wrong password, entry denied",
                success: false
            });
        }
    } catch (e) {
        console.error(`Error occurred`, e);
        res.status(500).json({
            message: "Some error in server",
            success: false
        });
    }
});

// // --------------------- Protected Route Example ---------------------
// router.get("/protected-route", authMiddleware, (req, res) => {
//     res.json({ success: true, message: "You have accessed a protected route!" });
// });

module.exports = router;
