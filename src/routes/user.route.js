import express from "express";
import { userDetails } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/authUser.js";


const userRoute = express.Router();

userRoute.get("/user-details",authUser,userDetails)
export default userRoute;