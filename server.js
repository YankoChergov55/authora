import app from "./app.js";
import logger from "./utils/logger.js";
import connectDB from "./config/db.js";
import appConfig from "./config/appConfig.js";

app.listen(appConfig.port, () => {
	logger.info(`connected to port ${appConfig.port}`);
	connectDB();
});
