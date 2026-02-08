import express from "express";
import { validate } from "../utils/commonFunctions.js";
import {
  forgotPassword,
  loginUser,
  logout,
  resendOtp,
  resetPassword,
  signup,
  verifyEmail,
  verifyOtp,
} from "../controllers/auth.controller.js";
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailOnlySchema,
  verifyEmailSchema,
} from "../validations/auth.js";

const authRoute = express.Router();

authRoute.post("/signup", validate(signupSchema), signup);
authRoute.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
authRoute.post("/resend-otp", validate(verifyEmailOnlySchema), resendOtp);
authRoute.post("/login", validate(loginSchema), loginUser);
authRoute.post(
  "/forgot-password",
  validate(verifyEmailOnlySchema),
  forgotPassword
);
authRoute.post("/verify-otp", validate(verifyEmailSchema), verifyOtp);
authRoute.post("/reset-password", validate(resetPasswordSchema), resetPassword);
authRoute.post("/logout", validate(verifyEmailOnlySchema), logout);

export default authRoute;
