const mongoose = require(`mongoose`);

const LandlordSchema_OTP = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  type: { type: String, default: "landlord" },
  password: { type: String, required: true },
  OTP: { type: String, required : true },
  propertyList: { type: Array, default: [] },
  conversations: { type: Array, default: [] },
  Allow_changes: { type: Boolean, default: false },//This is for forgotPassword, do not change this
  createdat: { type: Date, default: Date.now, expires: 300 },
});

const TenantSchema_OTP = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  OTP: { type: String },
  locality: { type: String, required: true },
  city: {type: String, required:false},
  gender: { type: String, required: true },
  smoke: { type: Boolean, required: true },
  veg: { type: Boolean, required: true },
  pets: { type: Boolean, required: true },
  flatmate: { type: Boolean, required: true },
  Allow_changes: { type: Boolean, default: false },//This is also for forgot password donot change this
  createdat: { type: Date, default: Date.now, expires: 300 },
});

module.exports = {
  Landlord_OTP: mongoose.model("LandLord_OTP", LandlordSchema_OTP),
  Tenant_OTP: mongoose.model("Tenant_OTP", TenantSchema_OTP),
};
