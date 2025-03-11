// const express = require(`express`)
// const Landlord = require(`../models/Landlord_models`)
// const {Landlord_OTP, Tenant_OTP} = require(`../models/OTP_models`)
// const router = express.Router();
// const bcrypt = require(`bcrypt`)
// const Sendmail = require(`../helper_funcs/mailSender`)
// // const authMiddleware = require("../middleware/auth-middleware");

// /*Contains authenticate/Landlord_Login, authenticate/Landlord_register, authenticate/verifyLandlord */

// async function Hashpassword(plainPassword) {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
//     return hashedPassword;
// }

// async function ComparePassword(enteredPassword, storedHash) {
//     const isMatch = await bcrypt.compare(enteredPassword, storedHash);
//     return isMatch;
// }

// router.post(`/Landlord_register`,async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const checkExistingUser = await Landlord.findOne({$or: [ { email }]});
//         if(checkExistingUser){
//             res.status(400).json({
//                 succcess : false,
//                 message : `An user already exists with the given credentials`,
//                 status : `400`
//             })
//         }
//         else{

//             //If the user again requests OTP this should handle it, it updates the LandlordSchema with a new OTP. The frontend guys can keep a minimum
//             //time limit to requests OTP.Landlord_OTP schema expires in 5mins
//             const checkExistingUser_withOTP = await Landlord_OTP.findOne({$or: [ { email }]});
//             if(checkExistingUser_withOTP){
//                 let new_OTP = (Math.floor(100000 + Math.random() * 900000)).toString()
//                 await Sendmail(email, `Welcome once again to Roomble`, new_OTP);
//                 await checkExistingUser_withOTP.updateOne(
//                     { email: email },  // Find user by email
//                     { $set: { OTP: new_OTP } }  // Update the name field
//                 );
                
//                 res.json({
//                     message : "New OTP sent"
//                 })
//                 return;
//             }

//             let hashedPassword = await Hashpassword(password);
//             console.log(hashedPassword);

//             let generated_OTP = (Math.floor(100000 + Math.random() * 900000)).toString();

//             const newlyCreateduser = new Landlord_OTP({
//                 name : name, 
//                 email : email,
//                 password : hashedPassword,
//                 OTP : generated_OTP
//             })

//             //Creating a Landlord OTP type schema and saving it
//             await newlyCreateduser.save();
            
//             if (newlyCreateduser) {
//                 await Sendmail(email, `Welcome to Roomble!!`, `Your OTP is ${generated_OTP}`);
//                 res.redirect(`authenticate/verifyLandlord/${newlyCreateduser._id}`);
//               } else {
//                 res.status(400).json({
//                   success: false,
//                   message: "Unable to register user! please try again.",
//                 });
//             }
//         }
//     } catch (e) {
//         console.log(`Error occured `, e);
//         res.status(500).json({
//             message : "Some error in server",
//             success : false
//         })
//     }
// })


// router.post(`/verifyLandlord/:id`, async (req, res) => {
//     try {
//         const {Entered_OTP} = req.body;
//         const userid = req.params.id;
//         if(!userid){
//             res.json({
//                 message : "OTP isn't generated, Try again"
//             })
//         }
//         else{
//             const Landlord_withOTP = await Landlord_OTP.findById(userid);
//             //If cannot find user in Landlord_OTp schema
//             if(!Landlord_withOTP){
//                 res.status(404).json({
//                     success : false,
//                     message : "Your session has expired"
//                 })
//             }
//             else{
//                 //Pretty self explanatory lines..
//                 if(Entered_OTP === Landlord_withOTP.OTP){

//                     const newLandlord = new Landlord({
//                         name : Landlord_withOTP.name,
//                         email : Landlord_withOTP.email,
//                         password : Landlord_withOTP.password
//                     })

//                     await newLandlord.save();

//                     res.status(201).json({
//                         success : true,
//                         message : "User successfully registered"

//                     })
//                 }
//             }
//         }
//     } catch(e){
//         console.log(`Motherfucking error occureed`,e);
//         res.status(500).json({
//             success : false,
//             message : "Some error in server"
//         })
//     }
// })



// router.post(`/Landlord_Login`, async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         let enteredPassword = password;
//         const findLandlord = await Landlord.findOne({$or: [ { email }]});
//         if(!findLandlord){
//             res.status(404).json({
//                 success : false,
//                 message : "No user exits.",
//                 status : "404"
//             })
//         }
//         else{
//             let result = await ComparePassword(enteredPassword, findLandlord.password);
            
//             if( result){
//                 res.status(200).json({
//                     success : true,
//                     name : findLandlord.name,
//                     message : "Successful Login"
//                 })
//             }
//             else{
//                 res.status(401).json({
//                     status : "401",
//                     message : "Wrong password, entry denied",
//                     success : false
//                 })
//             }
//         }

//     } catch (e) {
//         console.log(`Error occured `, e);
//         res.status(500).json({
//             message : "Some error in server",
//             success : false
//         })
//     }
// })

// module.exports = router;
const express = require(`express`);
const jwt = require("jsonwebtoken"); // JWT for token authentication
const bcrypt = require(`bcrypt`);
const Landlord = require(`../models/Landlord_models`);
const { Landlord_OTP } = require(`../models/OTP_models`);
const router = express.Router();
const Sendmail = require(`../helper_funcs/mailSender`);
const authMiddleware = require("../middleware/auth-middleware"); // Middleware for JWT auth

const SECRET_KEY = "your_secret_key"; // Change this to a secure secret key

async function Hashpassword(plainPassword) {
    return await bcrypt.hash(plainPassword, 10);
}

async function ComparePassword(enteredPassword, storedHash) {
    return await bcrypt.compare(enteredPassword, storedHash);
}

// --------------------- Landlord Registration ---------------------
router.post(`/Landlord_register`, async (req, res) => {
    try {
        const { name, email, password, phone, properties } = req.body;
        const checkExistingUser = await Landlord.findOne({ email });

        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: `A landlord already exists with the given email`,
                status: `400`
            });
        }

        // If user already requested OTP, update OTP instead of creating a new entry
        const checkExistingUser_withOTP = await Landlord_OTP.findOne({ email });
        if (checkExistingUser_withOTP) {
            let new_OTP = (Math.floor(100000 + Math.random() * 900000)).toString();
            await Sendmail(email, `Welcome once again to Roomble`, new_OTP);
            await checkExistingUser_withOTP.updateOne({ OTP: new_OTP });

            return res.json({ message: "New OTP sent" });
        }

        let hashedPassword = await Hashpassword(password);
        let generated_OTP = (Math.floor(100000 + Math.random() * 900000)).toString();

        const newlyCreatedUser = new Landlord_OTP({
            name,
            email,
            password: hashedPassword,
            OTP: generated_OTP,
            phone,
            properties
        });

        await newlyCreatedUser.save();

        if (newlyCreatedUser) {
            await Sendmail(email, `Welcome to Roomble!!`, `Your OTP is ${generated_OTP}`);
            res.redirect(`authenticate/verifyLandlord/${newlyCreatedUser._id}`);
        } else {
            res.status(400).json({
                success: false,
                message: "Unable to register landlord! Please try again."
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

// --------------------- OTP Verification & Landlord Creation ---------------------
router.post(`/verifyLandlord/:id`, async (req, res) => {
    try {
        const { Entered_OTP } = req.body;
        const userId = req.params.id;

        if (!userId) {
            return res.json({ message: "OTP isn't generated, Try again" });
        }

        const Landlord_withOTP = await Landlord_OTP.findById(userId);

        if (!Landlord_withOTP) {
            return res.status(404).json({
                success: false,
                message: "Your session has expired"
            });
        }

        if (Entered_OTP === Landlord_withOTP.OTP) {
            const newLandlord = new Landlord({
                name: Landlord_withOTP.name,
                email: Landlord_withOTP.email,
                password: Landlord_withOTP.password,
                phone: Landlord_withOTP.phone,
                properties: Landlord_withOTP.properties
            });

            await newLandlord.save();

            res.status(201).json({
                success: true,
                message: "Landlord successfully registered"
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

// --------------------- Landlord Login with JWT Token ---------------------
router.post(`/Landlord_login`, async (req, res) => {
    try {
        const { email, password } = req.body;
        const findLandlord = await Landlord.findOne({ email });

        if (!findLandlord) {
            return res.status(404).json({
                success: false,
                message: "No landlord exists.",
                status: "404"
            });
        }

        let result = await ComparePassword(password, findLandlord.password);

        if (result) {
            // Generate JWT token
            const token = jwt.sign({ id: findLandlord._id, email: findLandlord.email }, SECRET_KEY, { expiresIn: "1h" });

            res.status(200).json({
                success: true,
                name: findLandlord.name,
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
