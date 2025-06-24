export default class AppError extends Error {
	constructor(message = "", status = 500, details = null) {
		super(message);
		this.status = status;
		this.details = details;

		Error.captureStackTrace(this, AppError);

		this.isOperational = true;
	}
}
