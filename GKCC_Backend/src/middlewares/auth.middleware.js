import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from header
  
  if (!token) {
    return next(new ApiError(401, 'No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next(); // Proceed to the next middleware   
  } catch (error) {
    return next(new ApiError(401, 'Invalid token'));
  }
};

export { authMiddleware };
