import mongoose from "mongoose";
import appConfig from "./appConfig.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
	try {
		const mongo = await mongoose.connect(appConfig.mongodb);
		logger.info(`db connected to ${mongo.connection.host}`);
	} catch (error) {
		logger.error(`db is not connecting because of ${error}`);
	}
};

export default connectDB;
