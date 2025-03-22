const express = require(`express`);
const jwt = require(`jsonwebtoken`);
const router = express.Router();
require(`dotenv`).config(`../.env`); // Load environment variables
const Tenant = require("../models/Tenant");
const mongoose = require(`mongoose`);
const Property = require(`../models/Property`);
const authMiddleware = require(`../middlewares/checkuser`);
const Towns = require("../models/Towns");
const SECRET_KEY = process.env.SECRET_KEY;

const calculateRecommendationScore = (tenant, flatmate, townData) => {
  const alpha = 0.7; // Weight for locality importance

  const distance = townData.distances[flatmate.locality] || 100; // Default 100 if unknown
  const localitySimilarity = 1 / (1 + distance);

  let booleanMatches = 0;
  if (flatmate.gender === tenant.gender) booleanMatches++;
  if (flatmate.smoke === tenant.smoke) booleanMatches++;
  if (flatmate.veg === tenant.veg) booleanMatches++;
  if (flatmate.pets === tenant.pets) booleanMatches++;

  const booleanSimilarity = booleanMatches / 4; // Normalize to [0,1]

  const score = alpha * localitySimilarity + (1 - alpha) * booleanSimilarity;
  return score;
};

//pass the authtoken and accounttype into header
router.get(`/get_bookmarks`, authMiddleware, async (req, res) => {
  try {
    const emailid = req.user.email;
    let user = await Tenant.findOne({ email: emailid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token",
      });
    }
    // Flatmate_bookmarks = await Tenant.find({ _id : { $in : user.bookmarks_tenants }}).select(`email name locality`);
    // Property_bookmarks = await Property.find({ _id : { $in : user.bookmarks_property}}).select(`name town address area bhk price`);

    /*If lets say some user Bookmarked a user previously but now he has deleted his account, then I simply dont return that user and remove it from this bookmarked property as well */
    Flatmate_bookmarks = [];
    Property_bookmarks = [];
    const townData = await Towns.findOne({ name: user.locality });
    //Code to delete the user id that has deleted it's account is left to add
    for (let id of user.bookmarks_tenants) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`!!!!INVALID ID FOUND!!!!!`);
        console.log(id);
        return res.status(400).json({ error: `${id} is invalid ID` });
      }
      let tenantToBookmark = await Tenant.findById(id).select(
        `email name locality city Images`
      );
      if (tenantToBookmark) {
        console.log(`Your town data is ${townData}`);
        if (townData) {
          const score = calculateRecommendationScore(
            user,
            tenantToBookmark,
            townData
          );
          tenantToBookmark = tenantToBookmark.toObject(); // Convert to plain object
          tenantToBookmark.score = score; // Add score
          console.log(tenantToBookmark);
          console.log(`your score is ${score}`);
        }
        Flatmate_bookmarks.push(tenantToBookmark);
      }
    }
    console.log(Flatmate_bookmarks);
    for (let id of user.bookmarks_property) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`!!!!INVALID ID FOUND!!!!!`);
        console.log(id);
        return res.status(400).json({ error: `${id} is invalid ID` });
      }
      let propertyToBookmark = await Property.findById(id).select(
        `name town address area bhk price Images`
      );
      if (propertyToBookmark) {
        Property_bookmarks.push(propertyToBookmark);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Found ${Flatmate_bookmarks.length} Flatmate Bookmarks and ${Property_bookmarks.length} Property Bookmarks`,
      FlatmateBookMarks: Flatmate_bookmarks,
      PropertyBookMarks: Property_bookmarks
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Error in server :( really sorry.",
    });
  }
});

//Pass the thing : {flatmate or property (All lower case)},id in Body, action = {"bookmark", "unmark"} and authtoken in the header
router.post(`/edit_bookmarks`, authMiddleware, async (req, res) => {
  try {
    const userid = req.user.id;

    const { action, thing, id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`!!!!INVALID ID FOUND!!!!!`);
      console.log(id);
      return res.status(400).json({ error: `${id} is invalid ID` });
    }

    if (thing === `flatmate` && action === `bookmark`) {
      let exists = await Tenant.exists({ _id: id });
      if (exists) {
        await Tenant.findByIdAndUpdate(
          userid,
          { $addToSet: { bookmarks_tenants: id } },
          { new: true }
        );

        return res.status(200).json({
          status: true,
          message: "Successfully added tenant to Bookmarks",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No such Tenant exists",
        });
      }
    } else if (thing === `property` && action === `bookmark`) {
      let exists = await Property.exists({ _id: id });
      if (exists) {
        await Tenant.findByIdAndUpdate(
          userid,
          { $addToSet: { bookmarks_property: id } },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          message: "Successfully added property to your Bookmarks",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No such Property exists",
        });
      }
    } else if (thing === `flatmate` && action === `unmark`) {
      let user = await Tenant.findById(userid);
      if (user.bookmarks_tenants.includes(id)) {
        user.bookmarks_tenants = user.bookmarks_tenants.filter(
          (elem) => elem != id
        );
        await user.save();

        return res.status(200).json({
          success: true,
          message: "Successfule unmarked",
        });
      } else {
        return res.status(404).json({
          success: true,
          message: "No such bookmark exists",
        });
      }
    } else if (thing === `property` && action === `unmark`) {
      let user = await Tenant.findById(userid);
      if (user.bookmarks_property.includes(id)) {
        user.bookmarks_property = user.bookmarks_property.filter(
          (elem) => elem != id
        );

        await user.save();

        return res.status(200).json({
          success: true,
          message: "Successfully unmarked the user",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No such property is bookmarked",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Incorrect thing to be bookmarked",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Some internal Server error :( Please try again.",
    });
  }
});

module.exports = router;
