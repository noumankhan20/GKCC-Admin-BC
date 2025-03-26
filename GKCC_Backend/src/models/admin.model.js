import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";

// Define the admin schema
const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      unique: true, // Ensure unique email addresses
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    position: {
      type: String,
      enum: ["Superadmin", "Association Head", "Sub Association Head","CMSAdmin"],
      required: true,
    },
    association: {
      type: String,
    },
    country: {
      type: String,
      required: true,
      minlength: 2,
    },
    GKCCId: {
      type: String,
    },
    city: {
      type: String,
      required: true,
      minlength: 2,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to hash the password before saving it to the database
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with the stored hashed password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the admin model
const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
