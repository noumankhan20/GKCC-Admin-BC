import mongoose from "mongoose";
import bcrypt from "bcrypt";


const vendorSchema = new mongoose.Schema({
    vendorName: {
      type: String,
      required: true,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    vendorEmail: {
      type: String,
      required: true,
    },
    streetName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    googleMapsLink: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    offerType: {
      type: String,
      enum: ['products', 'services'],
      required: true,
    },
    productsOffered: {
      type: String,
      required: function () {
        return this.offerType === 'products';
      },
    },
    servicesOffered: {
      type: String,
      required: function () {
        return this.offerType === 'services';
      },
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    discountDetails: {
      type: String,
      required: true,
    },
    freeOfferOn: {
      type: String,
      required: true,
    },
    offerStartDate: {
      type: Date,
      required: true,
    },
    offerEndDate: {
      type: Date,
      required: true,
    },
    vendorSupport: {
      type: String,
      enum: ['donation', 'advertisement', 'commission', 'other'],
      required: true,
    },
    socialMediaLinks: {
      instagramLink: {
        type: String,
      },
      facebookLink: {
        type: String,
      },
      linkedinLink: {
        type: String,
      },
    },
    association: {
      type: String,
      required: true,
    },
    customAssociation: {
      type: String,
      required: function () {
        return this.association === 'Other';
      },
    },
    associationMember: {
      type: String,
      required: function () {
        return this.association !== 'Other';
      },
    },
    confirmation: {
      type: Boolean,
      required: true,
    },
    signature: {
      type: String, // Will store the signature as a data URL
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    }
  });

// Hash the password before saving
vendorSchema.pre("save", async function(next) {
    if (this.isModified("password") || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare passwords
vendorSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
