import jwt from "express-jwt";

export const requireSign = jwt({
	secret: process.env.JWT_SECRET,
	getToken: (req, res) => req.cookies.token,
	algorithms: ["HS256"]
});
