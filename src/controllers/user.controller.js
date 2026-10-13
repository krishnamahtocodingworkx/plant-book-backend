import User from "../models/User";
import { successResponse } from "../utils/commonFunctions";
import {
  ExceptionMessage,
  HttpStatusCode,
  HttpStatusMessage,
  SuccessMessage,
} from "../utils/responseData";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

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
