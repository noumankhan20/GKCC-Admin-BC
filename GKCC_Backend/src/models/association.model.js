import mongoose from "mongoose";
import bcrypt from "bcrypt";

const associationSchema = new mongoose.Schema(
  {
    associationName: {
      type: String,
      required: true,
      minlength: 2,
    },
    country: {
      type: String,
      required: true,
      minlength: 2,
    },
    locationCity: {
      type: String,
      required: true,
      minlength: 2,
    },
    GKCCId: {
      type: String,
    },
    associationContactNumber: {
      type: String,
      required: true,
      match: /^\+?[0-9]{4,15}$/,
    },
    associationEmail: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    websiteLink: {
      type: String,
      match:
        /^(https?:\/\/)?([\w\d\-]+\.){1,}[\w]{2,}(\/[\w\d\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
    },
    yearEstablished: {
      type: Number,
      required: true,
      min: 1800,
      max: new Date().getFullYear(),
    },
    numberOfMembers: {
      type: Number,
      required: true,
      min: 1,
      max: 1000000,
    },
    associationLogo: {
      type: String, // File path for the logo stored in local storage
    },
    president: {
      name: {
        type: String,
        required: true,
        minlength: 2,
      },
      mobileNumber: {
        type: String,
        required: true,
        match: /^\+?[0-9]{4,15}$/,
      },
      whatsappNumber: {
        type: String,
        required: true,
        match: /^\+?[0-9]{4,15}$/,
      },
      email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      },
      district: {
        type: String,
        required: true,
        minlength: 2,
      },
      taluka: {
        type: String,
        required: true,
        minlength: 2,
      },
      village: {
        type: String,
        required: true,
        minlength: 2,
      },
      signature: {
        type: String, // File path for the signature stored in local storage
        required: true,
      },
    },
    secretary: {
      name: {
        type: String,
        required: true,
        minlength: 2,
      },
      mobileNumber: {
        type: String,
        required: true,
        match: /^\+?[0-9]{4,15}$/,
      },
      whatsappNumber: {
        type: String,
        required: true,
        match: /^\+?[0-9]{4,15}$/,
      },
      district: {
        type: String,
        required: true,
        minlength: 2,
      },
      taluka: {
        type: String,
        required: true,
        minlength: 2,
      },
      village: {
        type: String,
        required: true,
        minlength: 2,
      },
    },
    associationActivities: {
      type: String,
      required: true,
      minlength: 10,
    },
    activityDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Hash the password before saving to the database
associationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Association = mongoose.model("Association", associationSchema);
export default Association;
