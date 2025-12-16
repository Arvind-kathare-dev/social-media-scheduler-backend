import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import responseHandler from "../utils/responseHandler.js";

dotenv.config();

/**
 * Middleware to authenticate user using JWT token only
 */
export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        // Check Bearer token
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return responseHandler.unauthorized(
                res,
                "Authorization token missing",
                401
            );
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach decoded data to request
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return responseHandler.unauthorized(
                res,
                "Token expired. Please login again.",
                401
            );
        }

        if (error.name === "JsonWebTokenError") {
            return responseHandler.unauthorized(
                res,
                "Invalid token.",
                401
            );
        }

        return responseHandler.error(
            res,
            "Authentication failed",
            error.message,
            500
        );
    }
};

export default authenticateToken;
