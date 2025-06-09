import { Schema, model } from "mongoose";
import { hash } from "bcryptjs";
import logger from "../utils/logger.js";

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: [true, "db: this username exists"],
			required: [true, "username field is required"],
		},
		email: {
			type: String,
			unique: [true, "db: this email already exists"],
			required: [true, "email is required for user creation"],
		},
		password: {
			type: String,
			required: [true, "password is required for user creation"],
		},
		role: {
			type: String,
			default: "user",
			enum: ["user", "admin"],
		},
	},
	{ timestamps: true, collection: "Users" },
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		this.password = await hash(this.password, 15);
		next();
	} catch (error) {
		logger.error(error);
		next(error);
	}
});

const User = model("User", userSchema);

export default User;
