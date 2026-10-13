import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse } from "../utils/commonFunctions.js";
import {
  ExceptionMessage,
  HttpStatusCode,
  HttpStatusMessage,
} from "../utils/responseData.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(
          errorResponse(
            {},
            "Authentication token is required",
            HttpStatusMessage.UNAUTHORIZED,
            HttpStatusCode.UNAUTHORIZED,
          ),
        );
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify the JWT using the same secret as generateToken()
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user from the decoded token
    const user = await User.findById(decoded._id);

    if (!user) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(
          errorResponse(
            {},
            ExceptionMessage.USER_NOT_EXISTS,
            HttpStatusMessage.UNAUTHORIZED,
            HttpStatusCode.UNAUTHORIZED,
          ),
        );
    }

    // 4. Ensure the token is still valid for this user's session
    if (!user.token || user.token !== token) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(
          errorResponse(
            {},
            "Session expired or invalid token",
            HttpStatusMessage.UNAUTHORIZED,
            HttpStatusCode.UNAUTHORIZED,
          ),
        );
    }

    // 5. Attach authenticated user details to the request
    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    // 6. Continue to the controller
    next();
  } catch (error) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json(
        errorResponse(
          {},
          "Invalid or expired authentication token",
          HttpStatusMessage.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED,
        ),
      );
  }
};
