import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    nameofalbum: {
      type: String,
      required: true,
    },
    photosdetails: [
      {
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Photomedia = mongoose.model("photoMedia", photoSchema);

export default Photomedia;
