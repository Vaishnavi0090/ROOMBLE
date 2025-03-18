const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const jwt = require("jsonwebtoken");
const Sendmail = require("../helper_funcs/mailSender");
const authMiddleware = require("../middlewares/checkuser");
const SECRET_KEY = process.env.SECRET_KEY;
const Landlord = require("../models/Landlord");
const Tenant = require("../models/Tenant");
const mongoose = require('mongoose');

const { Landlord_OTP, Tenant_OTP } = require("../models/OTP_models");


//send newEmail, oldEmail and accounttype in the request
router.post("/requestEmailUpdate", authMiddleware, async (req, res) => {
    try {
        const { newEmail, oldEmail, accounttype } = req.body;

        if (accounttype !== "tenant" && accounttype !== "landlord") {
            return res.status(400).json({
                success: false,
                message: "Invalid account type."
            });
        }
    

        // Check if new email is already in use
        let emailExists = await Tenant.findOne({ email: newEmail }) || await Landlord.findOne({ email: newEmail });

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "This email is already in use. Please try a different email."
            });
        }

        // Generate OTP
        const new_OTP = (Math.floor(100000 + Math.random() * 900000)).toString();

        // Send OTP to new email
        await Sendmail(newEmail, "Roomble - Email Update OTP", `Your OTP for updating email is: ${new_OTP}`);

        // Check if OTP record exists
        let otpModel = accounttype === "tenant" ? Tenant_OTP : Landlord_OTP;
        let otpRecord = await otpModel.findOne({ email: newEmail });

        if (otpRecord) 
        {
            //if there does exists a record for the newEmail, say if I am re-requesting before verification,
            await otpRecord.updateOne({ OTP: new_OTP, Allow_changes: false });
            //changes will be allowed only after the verification
        } else {
            // Create new OTP record in case the record does not exist
            let newOTPRecord = new otpModel({
                email: newEmail,
                OTP: new_OTP,
                Allow_changes: false
            });
            await newOTPRecord.save();
        }

        return res.status(200).json({
            success: true,
            message: "OTP has been sent to your new email. Please verify it to proceed."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});


// 🔹 Step 2: Verify OTP and Change Email
// send userId, newEmail, enteredOTP and accounttype in the request


router.post("/verify-email-change", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const newEmail = req.body.newEmail;
        const enteredOTP = req.body.otp;
        const accounttype = req.body.accounttype;

        // Validate input
        if(!newEmail || !enteredOTP || !accounttype) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Check if new email is already in use
        const emailExists = await Tenant.findOne({ email: newEmail }).session(session) || 
                          await Landlord.findOne({ email: newEmail }).session(session);

        if (emailExists) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "This email is already in use"
            });
        }

        // Find and validate OTP record
        const otpModel = accounttype === "tenant" ? Tenant_OTP : Landlord_OTP;
        const otpRecord = await otpModel.findOne({ email: newEmail }).session(session);

        if (!otpRecord) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "OTP not found, please request a new OTP"
            });
        }

        // Check OTP expiration (assuming OTP expires after 10 minutes)
        const otpAge = (Date.now() - otpRecord.updatedAt) / (1000 * 60); // in minutes
        if (otpAge > 10) {
            await otpRecord.deleteOne({ session });
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({
                success: false,
                message: "OTP has expired, please request a new one"
            });
        }

        if (otpRecord.OTP !== enteredOTP) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Update user email
        const userModel = accounttype === "tenant" ? Tenant : Landlord;
        const user = await userModel.findByIdAndUpdate(
            userId, 
            { email: newEmail }, 
            { new: true, session }
        );

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete OTP record
        await otpRecord.deleteOne({ session });

        // Generate new JWT
        const newToken = jwt.sign(
            { id: user._id, email: user.email, role: accounttype },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Email updated successfully",
            token: newToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error in email verification:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;