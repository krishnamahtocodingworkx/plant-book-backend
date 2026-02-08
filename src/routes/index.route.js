import express from "express";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";

const mainRoutes = express.Router();

mainRoutes.use("/auth", authRoute);
mainRoutes.use("/user", userRoute);

export default mainRoutes;
