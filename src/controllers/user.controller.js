import User from "../models/User.js";
import { successResponse } from "../utils/commonFunctions.js";
import {
  ExceptionMessage,
  HttpStatusCode,
  HttpStatusMessage,
  SuccessMessage,
} from "../utils/responseData.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, {
      token: 0,
      password: 0,
    });

    return res
      .status(HttpStatusCode.OK)
      .json(
        successResponse(
          user,
          SuccessMessage.USER_PROFILE,
          HttpStatusMessage.OK,
          HttpStatusCode.OK,
        ),
      );
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          error,
          ExceptionMessage.INTERNAL_SERVER_ERROR,
          HttpStatusMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};
