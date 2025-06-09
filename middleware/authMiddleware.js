import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import appConfig from "../config/appConfig.js";
import User from "../users/userModel.js";

export const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new AppError("No token provided", 401);
		}

		const token = authHeader.split(" ")[1];

		const { id } = jwt.verify(token, appConfig.accessJWT);

		const user = await User.findById(id).select("-password");
		if (!user) {
			throw new AppError("User not found", 404);
		}

		req.user = user;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return next(
				new AppError(
					"Access token expired, please go to /refresh to get a new one",
					401,
				),
			);
		}
		if (error.name === "JsonWebTokenError") {
			return next(new AppError("Invalid token. Access denied.", 401));
		}
		if (error.name === "NotBeforeError") {
			return next(new AppError("Token not active yet.", 401));
		}

		if (error instanceof AppError) {
			return next(error);
		}

		// Catch-all
		next(new AppError("Authentication failed", 401));
	}
};

export const authorize = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user) {
			return next(new AppError("Not authenticated", 401));
		}

		console.log(req.user);
		if (!allowedRoles.includes(req.user.role)) {
			return next(new AppError("Not authorized", 403));
		}

		next();
	};
};
