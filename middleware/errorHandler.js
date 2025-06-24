import logger from "../utils/logger.js";
import appConfig from "../config/appConfig.js";

const errorHandler = (err, req, res, next) => {
	logger.error(err);

	let statusCode = err.status || 500;
	let message = err.message || "Something went wrong";

	const errResponse = {
		success: false,
		message,
		statusCode,
	};

	if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
		return res.status(401).json({ message: "Invalid or expired token" });
	}

	// Handle Mongoose validation errors
	if (err.name === "ValidationError") {
		const validationErrors = Object.values(err.errors).map(
			(val) => val.message,
		);
		return res.status(400).json({
			success: false,
			message: "Validation Error from Mongo",
			details: validationErrors,
		});
	}

	// Production safety: Only expose operational errors
	if (appConfig.nodeENV === "production" && !err.isOperational) {
		statusCode = 500;
		message = "Internal Server Error";
	}

	// Add details only for operational errors
	if (err.details && err.isOperational) {
		errResponse.details = err.details;
	}

	if (appConfig.nodeENV !== "production") {
		errResponse.name = err.name;
		errResponse.stack = err.stack;
	}

	return res.status(statusCode).json(errResponse);
};

export default errorHandler;
