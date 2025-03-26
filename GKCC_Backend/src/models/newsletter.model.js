import mongoose from "mongoose";

const newsletter = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    newsletterTypes: {
      type:String,
      enum:["viewable","archives"],
      required: true,

    },
    section: [
      {
        photo: {
          type: String,
        },
        text: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const NewsLetter = mongoose.model("Newsletter", newsletter);

export default NewsLetter;



