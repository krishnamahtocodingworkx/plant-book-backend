import express from "express";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import postRouter from "./post.route.js";
import likeRouter from "./like.route.js";

const mainRoutes = express.Router();

mainRoutes.use("/auth", authRoute);
mainRoutes.use("/user", authMiddleware, userRoute);
mainRoutes.use("/post", authMiddleware, postRouter);
mainRoutes.use("/like", authMiddleware, likeRouter);

export default mainRoutes;
