import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    nameofalbum: {
      type: String,
      required: true,
    },
    videosdetails: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Videomedia = mongoose.model("VideoMedia", videoSchema);

export default Videomedia;
