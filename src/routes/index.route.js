import express from "express";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import { authMiddleware } from "../middlewares/auth.middleware.js  ";

const mainRoutes = express.Router();

mainRoutes.use("/auth", authRoute);
mainRoutes.use("/user", authMiddleware, userRoute);

export default mainRoutes;
