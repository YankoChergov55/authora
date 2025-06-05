import "dotenv/config";

const appConfig = {
	port: process.env.PORT || 3000,
	mongodb: process.env.MONGODB_URI || "mongodb://localhost:27017/s1-auth-api",
};

export default appConfig;
