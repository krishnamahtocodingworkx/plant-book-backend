import express from "express";
import { getUserProfile } from "../controllers/user.controller.js";

const userRoute = express.Router();
userRoute.get("/profile", getUserProfile);

export default userRoute;
