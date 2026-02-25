import User from "../models/User.js";
import { successResponse } from "../utils/commonFunctions.js";

export const userDetails = async (req, res) => {
    try {
        const userId = req.user._id;   // ✅ clean & safe
        console.log("user id is", userId);

        const userData = await User.findById(userId).select("-password");

        return res.json({
            success: true,
            userData
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};