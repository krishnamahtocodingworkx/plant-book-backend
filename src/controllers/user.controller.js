import User from "../models/User.js";
import { errorResponse, successResponse } from "../utils/commonFunctions.js";
import {
  ExceptionMessage,
  HttpStatusCode,
  HttpStatusMessage,
  SuccessMessage,
} from "../utils/responseData.js";

const userController = {
  getUserProfile: async (req, res) => {
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
  },

  searchUsers: async (req, res) => {
    try {
      const { search } = req.query;

      if (!search?.trim()) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(
            errorResponse(
              {},
              ExceptionMessage.SEARCH_USER,
              HttpStatusMessage.BAD_REQUEST,
              HttpStatusCode.BAD_REQUEST,
            ),
          );
      }

      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );

      const users = await User.find({
        $or: [
          { userName: searchRegex },
          { name: searchRegex },
          { email: searchRegex },
        ],
      })
        .select("name userName email profilePicture")
        .limit(20)
        .lean();

      return res
        .status(HttpStatusCode.OK)
        .json(
          successResponse(
            users,
            SuccessMessage.USER_FETCHED,
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
  },
};

export default userController;
