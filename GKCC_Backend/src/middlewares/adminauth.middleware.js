import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import Admin from "../models/admin.model.js";

const adminAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new ApiError(
        401,
        "No token provided",
        "Please provide a valid authentication token."
      )
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

    const admin = await Admin.findById(decoded.id).select("-password"); // Fetch admin details from DB

    if (!admin) {
      return next(
        new ApiError(404, "Admin not found", "The admin does not exist.")
      );
    }

    req.admin = admin; // Attach admin data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return next(
      new ApiError(
        401,
        "Invalid token",
        "The token provided is invalid or expired."
      )
    );
  }
};

export { adminAuthMiddleware };
