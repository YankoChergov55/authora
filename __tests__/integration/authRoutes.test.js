import {
	describe,
	it,
	expect,
	beforeAll,
	afterAll,
	beforeEach,
} from "@jest/globals";
import mongoose from "mongoose";
import app from "../../app"; // or wherever your Express app is
import supertest from "supertest";
import User from "../../users/userModel.js";
import jwt from "jsonwebtoken";
import appConfig from "../../config/appConfig.js";

const request = supertest(app);

beforeAll(async () => {
	await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
	await mongoose.connection.dropDatabase(); // clean test DB
	await mongoose.connection.close();
});

beforeEach(async () => {
	await User.deleteMany({});
	await User.create([
		{
			username: "user1",
			password: "password1",
			email: "user1@email.com",
			role: "user",
		},
		{
			username: "admin1",
			password: "adminword1",
			email: "admin1@email.com",
			role: "admin",
		},
	]);
});

describe("POST /api/users/login", () => {
	it("returns 200 and tokens for valid credentials", async () => {
		const res = await request
			.post("/api/users/login")
			.send({ password: "password1", email: "user1@email.com" });

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("accessToken");
	});

	it("returns 401 for wrong email", async () => {
		const res = await request
			.post("/api/users/login")
			.send({ password: "password1", email: "not@found.com" });

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Password or Email is wrong");
	});

	it("returns 401 for wrong password", async () => {
		const res = await request
			.post("/api/users/login")
			.send({ password: "wrongpassword1", email: "user1@email.com" });

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Password or Email is wrong");
	});
});

describe("POST /api/users/refresh", () => {
	let user;

	beforeEach(async () => {
		user = await User.findOne({ email: "user1@email.com" });
	});

	it("returns new access token when refresh token is valid", async () => {
		const refreshToken = jwt.sign({ id: user._id }, appConfig.refreshJWT, {
			expiresIn: appConfig.refreshEXP,
		});

		const res = await request
			.post("/api/users/refresh")
			.set("Cookie", [`refreshtoken=${refreshToken}`]);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("accessToken");
	});

	it("returns 401 if refresh token is missing", async () => {
		const res = await request.post("/api/users/refresh");

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("No refresh token provided");
	});

	it("returns 403 if refresh token is invalid or expired", async () => {
		const expiredToken = jwt.sign({ id: user._id }, appConfig.refreshJWT, {
			expiresIn: -1,
		});

		const res = await request
			.post("/api/users/refresh")
			.set("Cookie", [`refreshtoken=${expiredToken}`]);

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe(
			"Refresh token expired, please log in again via /login",
		);
	});
});

describe("POST /api/users/logout", () => {
	it("clears the refresh token cookie and returns 200", async () => {
		const res = await request.post("/api/users/logout");
		const setCookieHeader = res.headers["set-cookie"];

		expect(res.statusCode).toBe(200);
		expect(setCookieHeader[0]).toMatch(/refreshtoken=;/i);
		expect(res.body.message).toBe(
			"User is logged out, please remove access token from client headers.",
		);
	});
});
