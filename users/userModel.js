import { Schema, model } from "mongoose";

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
	},
	{ timestamps: true, collection: "Users" },
);

const User = model("User", userSchema);

export default User;
