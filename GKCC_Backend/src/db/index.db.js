import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Ensure you're passing the correct URI with the DB_NAME
const connectDB = async () => {
    try {
        // Don't append DB_NAME here, as it's already included in the URI
        const connectionInstance = await mongoose.connect(process.env.DB_URI);
        console.log(`\n MONGODB CONNECTED!! DB Host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("mongoDB error connection", error);
        process.exit(1); // Exit on failure
    }
};

export default connectDB;
