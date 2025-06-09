import { ZodError } from "zod/v4";
import AppError from "../utils/appError.js";

const validate = (schema) => (req, res, next) => {
	try {
		req.validatedData = schema.parse(req.body);
		next();
	} catch (err) {
		if (err instanceof ZodError) {
			const formattedErrors = Array.isArray(err.errors)
				? err.errors.map((e) => ({
						path: e.path.join("."),
						message: e.message,
					}))
				: [];

			return next(new AppError("Zod Validation Failed", 400, formattedErrors));
		}
		next(err);
	}
};

export default validate;
