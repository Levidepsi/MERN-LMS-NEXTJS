import jwt from "express-jwt";
import User from "../model/userModel.js";

export const requireSign = jwt({
	secret: process.env.JWT_SECRET
	getToken: (req, res) => req.cookies.token,
	algorithms: ["HS256"]
});

export const isInstructor = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id).exec();

		if (!user.role.includes("Instructor")) {
			return res.sendStatus(403);
		} else {
			next();
		}
	} catch (error) {
		console.log(error);
	}
};
