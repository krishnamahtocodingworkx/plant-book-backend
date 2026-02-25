import jwt from "jsonwebtoken"
import { successResponse } from "../utils/commonFunctions.js";
import { JWT_SECRET } from "../utils/config.js";
export const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.json({
                success: false,
                message: "User not Authorized please log in again"
            });
        }

        const token_decode = jwt.verify(token, JWT_SECRET);

        // ✅ attach user to request object
        req.user = token_decode;

        next();

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};

