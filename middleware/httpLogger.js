import { pinoHttp } from "pino-http";
import logger from "../utils/logger.js";

const httpLogger = pinoHttp({
	logger,
	customSuccessMessage: function (req, res) {
		return `${req.method} ${req.url} completed with ${res.statusCode}`;
	},
	customErrorMessage: function (req, res, err) {
		return `${req.method} ${req.url} failed with ${err.message}`;
	},
});

export default httpLogger;
