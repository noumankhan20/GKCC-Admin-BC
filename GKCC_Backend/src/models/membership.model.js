import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
// countryCode:{
//   type:String
// },

// Define the membership schema
const membershipSchema = new mongoose.Schema(
  {
    countryCode: {
      type: String,
    },
    association: { type: String },
    dob: { type: Date, required: true },
    bloodGroup: { type: String },
    education: { type: String },
    educationOther: { type: String },
    countryCode: { type: String },
    whatsappNumber: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    firstName: { type: String, required: true },
    middleName: { type: String },
    familyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String },
    internationalStateProvince: { type: String },
    internationalCity: { type: String },
    internationalPostalCode: { type: String },
    internationalCountry: { type: String },
    internationalStreetAddress: { type: String },
    internationalFlat: { type: String },
    internationalBlock: { type: String },
    area: { type: String },
    nativePincode: { type: String },
    nativeState: { type: String },
    nativeFlat: { type: String },
    nativeBlock: { type: String },
    nativeCity: { type: String },
    district: { type: String },
    talukaCity: { type: String },
    areaVillage: { type: String },
    pincode: { type: String },
    buildingFlat: { type: String },
    street: { type: String },
    spouseName: { type: String },
    children: {
      type: [childSchema], // Define children as an array of child objects
      default: [],
    },
    country: {
      type: String,
    },
    fatherName: { type: String },
    motherName: { type: String },
    GKCCId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Method to compare passwords
membershipSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash the password before saving
membershipSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create the membership model
const Membership = mongoose.model("Membership", membershipSchema);

export default Membership;
