const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const jwt = require("jsonwebtoken");
const Sendmail = require("../helper_funcs/mailSender");
const authMiddleware = require("../middleware/checkuser");
const SECRET_KEY = process.env.SECRET_KEY;
const Landlord = require("../models/Landlord");
const Tenant = require("../models/Tenant");
const { Landlord_OTP, Tenant_OTP } = require("../models/OTP_models");

router.post("/requestEmailUpdate", authMiddleware, async (req, res) => {
    try {
        const { newEmail, oldEmail, accountType } = req.body;

        if (accountType !== "tenant" && accounTtype !== "landlord") {
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
        let otpModel = accountType === "tenant" ? Tenant_OTP : Landlord_OTP;
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
router.post("/verify-email-change", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const newEmail = req.body.newEmail;
        const enteredOTP = req.body.otp;
        const accountType = req.body.accountType;

        if(!newEmail || !enteredOTP || !accountType){
            return res.status(400).json({
                success : false,
                message : "Missing Required Fields"
            })
        }


        // Find the OTP record for the new email and check for a valid accountType
        let otpRecord;
        if (accountType === "tenant") {
            otpRecord = await Tenant_OTP.findOne({ email: newEmail });
        } else if (accountType === "landlord") {
            otpRecord = await Landlord_OTP.findOne({ email: newEmail });
        } else {
            return res.status(400).json({ success: false, message: "Invalid account type" });
        }

        if(!otpRecord){
            return res.status(404).json({
                success : false,
                message : "OTP not found, kindly request a new OTP!!"
            })
        }
        if(otpRecord.OTP !== enteredOTP){
            return res.status(401).json({
                success : false,
                message : "Invalid OTP, please check again later!!"
            })
        }

        // Find user and update email
        let user;
        if (accountType === "tenant") {
            user = await Tenant.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
        } else if (accountType === "landlord") {
            user = await Landlord.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await otpRecord.deleteOne(); // deleting the OTP record since it was created for email updation only

        // Generate new JWT with updated email, since jwt tokens contain information about the email, so we need to generate a new one.
        const newToken = jwt.sign(
            { id: user._id, email: user.email, role: accountType },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            success: true,
            message: "Email updated successfully",
            token: newToken,
        });

    } catch (error) {
        console.log("Error in email updation :",error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

})
model.exports = router;
