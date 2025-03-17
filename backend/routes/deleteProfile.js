const express = require("express");
const router = express.Router();
require(`dotenv`).config(`../.env`);
const jwt = require(`jsonwebtoken`);
const SECRET_KEY = process.env.SECRET_KEY;
const Sendmail = require("../helper_funcs/mailSender");
const Landlord = require("../models/Landlord");
const Tenant = require("../models/Tenant");
const authMiddleware = require("../middlewares/checkuser");
const { Landlord_OTP, Tenant_OTP } = require("../models/OTP_models");
const Conversation = require("../models/Conversation");
const Review = require("../models/Review");
const Property = require("../models/Property");

//expect email and accounttype
router.post(`/deleteInitiate`, async (req, res) => {
  try {
    const { email, accounttype } = req.body;
    let user;
    if (accounttype === `tenant`) {
      user = await Tenant.findOne({ email: email });
    } else if (accounttype === `landlord`) {
      user = await Landlord.findOne({ email: email });
    } else {
      return res.status(400).json({
        success: false,
        message: "Bad Account type",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No such user exists",
      });
    } else {
      const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
        expiresIn: "5m",
      });

      if (accounttype === `tenant`) {
        let ifExists = await Tenant_OTP.findOne({ email: email });

        if (ifExists) {
          let new_OTP = Math.floor(100000 + Math.random() * 900000).toString();
          await Sendmail(
            email,
            `Sorry to see you go, we hope we were helpful <3`,
            `Here is your OTP ${new_OTP}`
          );
          await ifExists.updateOne({ OTP: new_OTP });

          return res.status(200).json({
            success: true,
            message: "New OTP sent",
            authtoken: token,
          });
        }

        let new_OTP = Math.floor(100000 + Math.random() * 900000).toString();
        await Sendmail(
          email,
          `Welcome once again to Roomble`,
          `Hello, If it was you who was trying to delete your account, here's your OTP ${new_OTP}. However if this wasn't you, Kindly ignore.`
        );
        const newlyCreatedUser = new Tenant_OTP({
          name: user.name,
          email: user.email,
          password: user.password,
          OTP: new_OTP,
          locality: user.locality,
          smoke: user.smoke,
          pets: user.pets,
          veg: user.veg,
          gender: user.gender,
          flatmate: user.flatmate,
        });
        await newlyCreatedUser.save();

        return res.status(200).json({
          success: true,
          authtoken: token,
        });
      } else if (accounttype === `landlord`) {
        let ifExists = await Landlord_OTP.findOne({ email: email });

        if (ifExists) {
          let new_OTP = Math.floor(100000 + Math.random() * 900000).toString();
          await Sendmail(
            email,
            `Sorry to see you go, we hope we were helpful <3`,
            `Here is your OTP ${new_OTP}`
          );
          await ifExists.updateOne({ OTP: new_OTP });

          return res.status(200).json({
            success: true,
            message: "New OTP sent",
            authtoken: token,
          });
        }

        let new_OTP = Math.floor(100000 + Math.random() * 900000).toString();
        await Sendmail(
          email,
          `Welcome once again to Roomble`,
          `Hello, If it was you who was trying to delete your account, here's your OTP ${new_OTP}. However if this wasn't you, Kindly ignore.`
        );

        const newlyCreatedUser = new Landlord_OTP({
          name: user.name,
          type: user.type,
          email: user.email,
          password: user.password,
          OTP: new_OTP,
          propertyList: user.propertyList,
          conversations: user.conversations,
        });
        await newlyCreatedUser.save();

        return res.status(200).json({
          success: true,
          authtoken: token,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

//send email,accounttype and Entered_OTP
router.post(`/enterOTPtoDelete`, authMiddleware, async (req, res) => {
  try {
    let userEmail = req.user.email;
    let Entered_OTP = req.body.Entered_OTP;
    let accounttype = req.body.accounttype;
    // "accounttype
    let userOTP;
    if (accounttype === `tenant`) {
      userOTP = await Tenant_OTP.findOne({ email: userEmail });
    } else if (accounttype === `landlord`) {
      userOTP = await Landlord_OTP.findOne({ email: userEmail });
    } else {
      console.log(accounttype);
      return res.status(401).json({
        success: false,
        message: "Invalid Account Type",
      });
    }

    if (!userOTP) {
      return res.status(404).json({
        success: false,
        message: "Please request an OTP. Your OTP has been Expired/ Not sent.",
      });
    } else if (userOTP.OTP === Entered_OTP) {
        const deletedUser = await Tenant.findOneAndDelete({email : userEmail}) || await Landlord.findOneAndDelete({email : userEmail});
        if(!deletedUser){
            return res.status(404).json({
                success : false,
                message : "User not found or already deleted",
            });
        }

        // Delete related data
        if (accounttype === `tenant`) {
          await Conversation.deleteMany({ tenantEmail: userEmail });
          await Review.deleteMany({ tenantEmail: userEmail });
        } else if (accounttype === `landlord`) {
          await Property.deleteMany({ landlordEmail: userEmail });
          await Conversation.deleteMany({ landlordEmail: userEmail });
          await Review.deleteMany({ landlordEmail: userEmail });
        }

        const deletedUserOTP = await Tenant_OTP.findOneAndDelete({email : userEmail}) || await Landlord_OTP.findOneAndDelete({email : userEmail});

        return res.status(200).json({
            success : true,
            message : "Account and related data deleted successfully.",
        })
    } else {
      return res.status(401).json({
        success: false,
        message: "Wrong OTP, pls try again",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
});

module.exports = router;
