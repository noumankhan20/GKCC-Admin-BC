// models/Log.js
import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create the log model
const Log = mongoose.model("Log", logSchema);

export default Log;
