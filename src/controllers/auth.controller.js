import User from "../models/User.js";
import { otpTemplate } from "../templates/emailVerification.js";
import {
  errorResponse,
  generateOtp,
  generateToken,
  hashData,
  successResponse,
} from "../utils/commonFunctions.js";
import {
  ExceptionMessage,
  HttpStatusCode,
  HttpStatusMessage,
  SuccessMessage,
} from "../utils/responseData.js";
import { mailSender } from "../utils/mailSender.js";
import Otp from "../models/Otp.js";
import { forgotOtpTemplate } from "../templates/forgotOtpTemplate.js";

// Controller for user signup and sending verification OTP
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const emailInLowercase = email.toLowerCase();
    const userAlreadyExist = await User.findOne({ email: emailInLowercase });
    if (userAlreadyExist) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(
          errorResponse(
            {},
            ExceptionMessage.EMAIL_ALREADY_EXIST,
            HttpStatusMessage.BAD_REQUEST,
            HttpStatusCode.BAD_REQUEST
          )
        );
    }
    const hashedPassword = hashData(password);
    const { otp, expiresAt } = generateOtp();
    const newUser = new User({
      email: emailInLowercase,
      name,
      password: hashedPassword,
      role,
    });
    const addedUser = await newUser.save();
    const otpData = new Otp({
      userId: addedUser._id,
      otp,
      expiresAt,
    });
    await otpData.save();

    // Send OTP to user's email
    await mailSender(
      emailInLowercase,
      "Email Verification for Plant Book",
      otpTemplate(otp)
    );
    return res
      .status(HttpStatusCode.CREATED)
      .json(
        successResponse(
          addedUser,
          SuccessMessage.SIGNED_UP,
          HttpStatusMessage.CREATED,
          HttpStatusCode.CREATED
        )
      );
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          error,
          ExceptionMessage.INTERNAL_SERVER_ERROR,
          HttpStatusMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
  }
};
// controller for resending OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const isUserExists = await User.findOne({ email: email.toLowerCase() });
    if (!isUserExists) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          errorResponse(
            {},
            ExceptionMessage.USER_NOT_EXISTS,
            HttpStatusMessage.NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          )
        );
    }
    const otp = await Otp.findOne({ userId: isUserExists._id }).sort({
      createdAt: -1,
    });
    if (!otp || otp.expiresAt < new Date()) {
      const { otp: newOtp, expiresAt } = generateOtp();
      const otpData = new Otp({
        userId: isUserExists._id,
        otp: newOtp,
        expiresAt,
      });
      await otpData.save();
      // Send OTP to user's email
      await mailSender(
        email,
        "Resend Email Verification OTP for Plant Book",
        otpTemplate(newOtp)
      );
      return res
        .status(HttpStatusCode.OK)
        .json(
          successResponse(
            {},
            SuccessMessage.OTP_RESENT,
            HttpStatusMessage.OK,
            HttpStatusCode.OK
          )
        );
    }

    await mailSender(
      email,
      "Resend Email Verification OTP for Plant Book",
      otpTemplate(otp.otp)
    );

    return res
      .status(HttpStatusCode.OK)
      .json(
        successResponse(
          {},
          SuccessMessage.OTP_RESENT,
          HttpStatusMessage.OK,
          HttpStatusCode.OK
        )
      );
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          error,
          ExceptionMessage.INTERNAL_SERVER_ERROR,
          HttpStatusMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
  }
};
// Controller for verifying user's email using OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const isUserExists = await User.findOne({ email: email.toLowerCase() });
    if (!isUserExists) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          errorResponse(
            {},
            ExceptionMessage.USER_NOT_FOUND,
            HttpStatusMessage.NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          )
        );
    }
    const otpMatch = await Otp.findOne({
      userId: isUserExists._id,
    }).sort({ createdAt: -1 });
    if (!otpMatch) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          errorResponse(
            {},
            ExceptionMessage.OTP_NOT_FOUND,
            HttpStatusMessage.NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          )
        );
    }
    if (otpMatch.otp !== otp) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(
          errorResponse(
            {},
            ExceptionMessage.OTP_INVALID,
            HttpStatusMessage.BAD_REQUEST,
            HttpStatusCode.BAD_REQUEST
          )
        );
    }
    if (otpMatch.expiresAt < new Date()) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(
          errorResponse(
            {},
            ExceptionMessage.OTP_EXPIRED,
            HttpStatusMessage.BAD_REQUEST,
            HttpStatusCode.BAD_REQUEST
          )
        );
    }
    const token = generateToken({
      _id: isUserExists._id,
      email: isUserExists.email,
      role: isUserExists.role,
    });
    isUserExists.isEmailVerified = true;
    isUserExists.token = token;
    await isUserExists.save();
    await Otp.deleteOne({ userId: isUserExists._id });
    return res
      .status(HttpStatusCode.OK)
      .json(
        successResponse(
          isUserExists,
          SuccessMessage.EMAIL_VERIFIED,
          HttpStatusMessage.OK,
          HttpStatusCode.OK
        )
      );
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          error,
          ExceptionMessage.INTERNAL_SERVER_ERROR,
          HttpStatusMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
  }
};

// Controller for user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserExists = await User.findOne({ email: email.toLowerCase() });
    if (!isUserExists) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          errorResponse(
            {},
            ExceptionMessage.USER_NOT_EXISTS,
            HttpStatusMessage.NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          )
        );
    }
    const hashedPassword = hashData(password);
    if (isUserExists.password !== hashedPassword) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(
          errorResponse(
            {},
            ExceptionMessage.INVALID_PASSWORD,
            HttpStatusMessage.UNAUTHORIZED,
            HttpStatusCode.UNAUTHORIZED
          )
        );
    }
    if (!isUserExists.isEmailVerified) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(
          errorResponse(
            {},
            ExceptionMessage.EMAIL_NOT_VERIFIED,
            HttpStatusMessage.UNAUTHORIZED,
            HttpStatusCode.UNAUTHORIZED
          )
        );
    }
    const token = generateToken({
      _id: isUserExists._id,
      email: isUserExists.email,
      role: isUserExists.role,
    });
    isUserExists.token = token;
    await isUserExists.save();
    return res
      .status(HttpStatusCode.OK)
      .json(
        successResponse(
          isUserExists,
          SuccessMessage.LOGGED_IN,
          HttpStatusMessage.OK,
          HttpStatusCode.OK
        )
      );
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          error,
          ExceptionMessage.INTERNAL_SERVER_ERROR,
          HttpStatusMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
  }
};

// Controller for sending OTP for password reset
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const isUserExist = await User.findOne({ email: email.toLowerCase() });
    if (!isUserExist) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          errorResponse(
            {},
            ExceptionMessage.USER_NOT_EXISTS,
            HttpStatusMessage.NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          )
        );
    }
    const { otp, expiresAt } = generateOtp();
    const otpData = new Otp({
      userId: isUserExist._id,
      otp,
      expiresAt,
    });
    await otpData.save();
    // Send OTP to user's email
    await mailSender(
      email,
      "Password Reset OTP for Plant Book",
      forgotOtpTemplate(otp)
    );
    return res
      .status(HttpStatusCode.OK)
      .json(
        successResponse(
          {},
          SuccessMessage.OTP_SENT,
          HttpStatusMessage.OK,
          HttpStatusCode.OK
        )
      );
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          error,
          ExceptionMessage.INTERNAL_SERVER_ERROR,
          HttpStatusMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
  }
};

// Controller for verifying OTP for password reset
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const isUserExists = await User.findOne({ email: email.toLowerCase() });
    if (!isUserExists) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          errorResponse(
            {},
            ExceptionMessage.USER_NOT_EXISTS,
            HttpStatusMessage.NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          )
        );
    }
    const otpMatch = await Otp.findOne({
      userId: isUserExists._id,
    }).sort({ createdAt: -1 });
    if (!otpMatch) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          errorResponse(
            {},
            ExceptionMessage.OTP_NOT_FOUND,
            HttpStatusMessage.NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          )
        );
    }
    if (otpMatch.otp !== otp) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(
          errorResponse(
            {},
            ExceptionMessage.OTP_INVALID,
            HttpStatusMessage.BAD_REQUEST,
            HttpStatusCode.BAD_REQUEST
          )
        );
    }
    if (otpMatch.expiresAt < new Date()) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(
          errorResponse(
            {},
            ExceptionMessage.OTP_EXPIRED,
            HttpStatusMessage.BAD_REQUEST,
            HttpStatusCode.BAD_REQUEST
          )
        );
    }
    await Otp.deleteOne({ userId: isUserExists._id }).sort({ createdAt: -1 });
    return res
      .status(HttpStatusCode.OK)
      .json(
        successResponse(
          {},
          SuccessMessage.OTP_VERIFIED,
          HttpStatusMessage.OK,
          HttpStatusCode.OK
        )
      );
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          error,
          ExceptionMessage.INTERNAL_SERVER_ERROR,
          HttpStatusMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
  }
};

// Controller for resetting user's password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const isUserExists = await User.findOne({ email: email.toLowerCase() });
    if (!isUserExists) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          errorResponse(
            {},
            ExceptionMessage.USER_NOT_EXISTS,
            HttpStatusMessage.NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          )
        );
    }
    const hashedPassword = hashData(newPassword);
    const newToken = generateToken({
      _id: isUserExists._id,
      email: isUserExists.email,
      role: isUserExists.role,
    });
    isUserExists.password = hashedPassword;
    isUserExists.token = newToken;
    await isUserExists.save();
    return res
      .status(HttpStatusCode.OK)
      .json(
        successResponse(
          isUserExists,
          SuccessMessage.RESET_PASSWORD,
          HttpStatusMessage.OK,
          HttpStatusCode.OK
        )
      );
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          error,
          ExceptionMessage.INTERNAL_SERVER_ERROR,
          HttpStatusMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
  }
};

// Controller for user logout
export const logout = async (req, res) => {
  try {
    const { email } = req.body;
    const isUserExists = await User.findOne({ email: email.toLowerCase() });
    if (!isUserExists) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          errorResponse(
            {},
            ExceptionMessage.USER_NOT_EXISTS,
            HttpStatusMessage.NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          )
        );
    }
    isUserExists.token = null;
    await isUserExists.save();
    return res
      .status(HttpStatusCode.OK)
      .json(
        successResponse(
          {},
          SuccessMessage.LOGGED_OUT,
          HttpStatusMessage.OK,
          HttpStatusCode.OK
        )
      );
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          error,
          ExceptionMessage.INTERNAL_SERVER_ERROR,
          HttpStatusMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
  }
};
