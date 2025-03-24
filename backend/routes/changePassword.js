const express = require(`express`);
const router = express.Router();
require(`dotenv`).config(`../.env`); // Load environment variables
const jwt = require(`jsonwebtoken`);
const bcrypt = require(`bcrypt`);
const Sendmail = require("../helper_funcs/mailSender"); // MailSender
const authMiddleware = require("../middlewares/checkuser"); // Middleware for JWT auth

const SECRET_KEY = process.env.SECRET_KEY; // Change this to a secure secret key

const Landlord = require(`../models/Landlord`);
const Tenant = require(`../models/Tenant`);
const { Landlord_OTP, Tenant_OTP } = require(`../models/OTP_models`);

async function Hashpassword(plainPassword) {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
}

//Send accountType and email in the request body
router.post(`/enteremail`, async (req, res) => {
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
            `Welcome once again to Roomble`,
            `Here is your new OTP ${new_OTP}`
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
          `Hello, If it was you who was trying to change your password, here's your OTP ${new_OTP}. However if this wasn't you, Kindly ignore.`
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
            `Welcome once again to Roomble`,
            `Here is your new OTP ${new_OTP}`
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
          `Hello, If it was you who was trying to change your password, here's your OTP ${new_OTP}. However if this wasn't you, Kindly ignore.`
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
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

//send authtoken and accounttype and Entered_OTP
router.post(`/enterOTP`, authMiddleware, async (req, res) => {
  try {
    let useremail = req.user.email;
    let userid = req.user.id;
    let Entered_OTP = req.body.Entered_OTP;
    let accounttype = req.body.accounttype;
    // "accounttype
    let user;
    if (accounttype === `tenant`) {
      user = await Tenant_OTP.findOne({ email: useremail });
    } else if (accounttype === `landlord`) {
      user = await Landlord_OTP.findOne({ email: useremail });
    } else {
      // console.log(accounttype);
      return res.status(401).json({
        success: false,
        message: "Invalid Account Type",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Please request an OTP. Your OTP has been Expired/ Not sent.",
      });
    } else if (user.OTP === Entered_OTP) {
      // await ifExists.updateOne({ OTP: new_OTP });
      await user.updateOne({ Allow_changes: true });

      return res.status(200).json({
        success: true,
        message: "Correct OTP entered, access granted.",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Wrong OTP, pls try again",
      });
    }
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
});

//send accounttype and authtoken in header. newPassword in body
// not sure but we do need to send the oldPassword separately since authtoken does not contain info about the password afaik -> bikram
router.post(`/ChangePassword`, authMiddleware, async (req, res) => {
  try {
    let useremail = req.user.email;
    let newPassword = req.body.newPassword;
    let oldPassword = req.body.oldPassword;
    let accounttype = req.body.accounttype;

    if (!newPassword || !oldPassword || !accounttype) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const Hashedpassword = await Hashpassword(newPassword);
    
    if (accounttype === `tenant`) {
      let user = await Tenant_OTP.findOne({ email: useremail });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "OTP not found / OTP expired",
        });
      }
      if (user.Allow_changes === false) {
        return res.status(401).json({
          success: false,
          message: "Not Authorized to make changes",
        });
      }
      let tenant_user = await Tenant.findOne({ email: useremail });
      const isMatch = await bcrypt.compare(oldPassword, tenant_user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }
      
      tenant_user.password = Hashedpassword;
      await tenant_user.save();
      await Tenant_OTP.deleteOne({ email: useremail }); // Cleanup OTP record
      
      return res.status(200).json({
        success: true,
        message: "Successfully updated",
      });
    } else if (accounttype === `landlord`) {
      let user = await Landlord_OTP.findOne({ email: useremail });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "OTP not found / OTP expired",
        });
      }y
      if (user.Allow_changes === false) {
        return res.status(401).json({
          success: false,
          message: "Not Authorized to make changes",
        });
      }
      let landlord_user = await Landlord.findOne({ email: useremail });
      const isMatch = await bcrypt.compare(oldPassword, landlord_user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }
      
      landlord_user.password = Hashedpassword;
      await landlord_user.save();
      await Landlord_OTP.deleteOne({ email: useremail }); // Cleanup OTP record
      
      return res.status(200).json({  // Fixed status code from 404 to 200
        success: true,
        message: "Successfully updated",
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
