import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import httpLogger from "./middleware/httpLogger.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(httpLogger);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Welcome to the homepage of the auth api",
	});
});

app.use(errorHandler);

export default app;
