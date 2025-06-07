import "dotenv/config";
import AppError from "../utils/appError.js";

function requireEnvVar(name) {
	const value = process.env[name];
	if (!value) {
		throw new AppError(`Missing required environment variable: ${name}`);
	}
	return value;
}

const appConfig = {
	port: Number(process.env.PORT) || 3000,
	mongodb: process.env.MONGODB_URI || "mongodb://localhost:27017/s1-auth-api",
	nodeENV: process.env.NODE_ENV || "development",
	accessJWT: requireEnvVar("JWT_SECRET_ACCESS"),
	accessEXP: process.env.JWT_EXP_ACCESS || "15m",
	refreshJWT: requireEnvVar("JWT_SECRET_REFRESH"),
	refreshEXP: process.env.JWT_EXP_REFRESH || "1d",
};

export default appConfig;
