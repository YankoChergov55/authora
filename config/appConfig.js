import dotenv from "dotenv";
import AppError from "../utils/appError.js";

const env = process.env.NODE_ENV || "development";

const envFile = env === "test" ? ".env.test" : ".env";

dotenv.config({ path: envFile });

function requireEnvVar(name) {
	const value = process.env[name];
	if (!value) {
		throw new AppError(`Missing required environment variable: ${name}`);
	}
	return value;
}

const appConfig = {
	port: Number(process.env.PORT) || 3000,
	mongodb: requireEnvVar("MONGODB_URI"),
	nodeENV: env,
	accessJWT: requireEnvVar("JWT_SECRET_ACCESS"),
	accessEXP: process.env.JWT_EXP_ACCESS || "15m",
	refreshJWT: requireEnvVar("JWT_SECRET_REFRESH"),
	refreshEXP: process.env.JWT_EXP_REFRESH || "1d",
};

export default appConfig;
