const express = require(`express`);
const jwt = require(`jsonwebtoken`)
const bcrypt = require(`bcrypt`);
const Landlord = require(`../models/Landlord`);
const { Landlord_OTP, Tenant_OTP } = require("../models/OTP_models");
const router = express.Router();
require(`dotenv`).config(`../.env`); // Load environment variables
const Sendmail = require("../helper_funcs/mailSender");

const SECRET_KEY = process.env.SECRET_KEY;

async function Hashpassword(plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}

async function ComparePassword(enteredPassword, storedHash) {
    return await bcrypt.compare(enteredPassword, storedHash);
}


//Send name, email, password as Body
router.post(`/Landlord_Register`, async (req, res) => {
    try {
        const {name, email, password} = req.body;
        let checkExistingUser = await  Landlord.findOne({  email });

        if (checkExistingUser) {
            // console.log(checkExistingUser.email);
            return res.status(400).json({
                success: false,
                message: "A user already exists with the given credentials",
                status: 400
            });
        }

        const checkExistingUser_withOTP = await Landlord_OTP.findOne({ email : email });
        if (checkExistingUser_withOTP) {
            let new_OTP = (Math.floor(100000 + Math.random() * 900000)).toString();
            await Sendmail(email, `Welcome once again to Roomble`, new_OTP);
            //delete existing entry and create new one
            await Landlord_OTP.deleteOne({email});
            let hashedPassword = await Hashpassword(password);
            const newlyCreatedUser = new Landlord_OTP({
                name,
                email,
                password : hashedPassword,
                OTP : new_OTP
            })

            await newlyCreatedUser.save();

            return res.json({ message: `${newlyCreatedUser._id}`, success: true });
        }

        let hashedPassword = await Hashpassword(password);
        let generated_OTP = (Math.floor(100000 + Math.random() * 900000)).toString();

        const newlyCreatedUser = new Landlord_OTP({
            name,
            email,
            password : hashedPassword,
            OTP : generated_OTP
        })

        await newlyCreatedUser.save();


        if (newlyCreatedUser) {
            await Sendmail(email, `Welcome to Roomble!!`, `Your OTP is ${generated_OTP}`);
            res.status(400).json({
                success: true,
                message: `${newlyCreatedUser._id}`
            });
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

//Send Entered_OTP as body
router.post(`/verifyLandlord/:id`, async (req, res) => {
    try {
        const { Entered_OTP } = req.body;
        const userId = req.params.id;

        if (!userId) {
            return res.json({ message: "Invalid UserId" });
        }

        const Landlord_withOTP = await Landlord_OTP.findById(userId);
        
        if (!Landlord_withOTP) {
            return res.status(404).json({
                success: false,
                message: "Your session has expired"
            });
        }

        if(Entered_OTP === Landlord_withOTP.OTP){
            const newLandlord = new Landlord({
                name : Landlord_withOTP.name,
                email : Landlord_withOTP.email,
                password : Landlord_withOTP.password
            })

            await newLandlord.save();

            return res.status(201).json({
                success : true,
                message : "Successfully registered"
            });
        }
        else{
            return res.status(400).json({
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

//send email, password in req.body
router.post(`/Landlord_login`, async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await Landlord.findOne( { email });

        if(!user){
            return res.status(404).json({
                success : false,
                message : "No such user exists"
            })
        }

        let result = await ComparePassword(password, user.password);

        if(result){
            //Generating token to be sent
            const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

            return res.status(200).json({
                success : true,
                name : user.name,
                message : "Successful login",
                authtoken : token
            })
            
        } else{
            res.status(401).json({
                status: "401",
                message: "Wrong password, entry denied",
                success: false
            });
        }


    } catch (e) {
        // console.log(e);
        return res.status(500).json({
            success : false,
            message : "Internal Server error, really sorry"
        })
    }
});

module.exports = router;