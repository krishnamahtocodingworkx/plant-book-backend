import express from "express";
import userController from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.get("/profile", userController.getUserProfile);
userRoute.get("/search", userController.searchUsers);

export default userRoute;
