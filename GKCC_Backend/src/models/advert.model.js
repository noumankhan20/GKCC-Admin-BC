import mongoose from "mongoose";

const advertsponsor = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    advertimage: {
      type: String,
    },
    brochure: {
      type: String,
    },
    websitelink: {
      type: String,
    },
    divnumber: {
      type: String,
      enum: ["first", "second", "third", "fourth", "fifth", "sixth"],
      required:true
    },
  },
  {
    timestamps: true,
  }
);

const AdvertSponsor = mongoose.model("advertsponsor", advertsponsor);

export default AdvertSponsor;
