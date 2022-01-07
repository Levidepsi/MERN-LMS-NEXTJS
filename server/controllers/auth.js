import User from "../model/userModel.js";
import { hashPassword, comparePassword } from "../utils/auth.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name) {
			return res.status(400).send("Name Required");
		}

		if (!password || password.length < 6) {
			return res.status(400).send("Must be 6 characters");
		}
		let userExist = await User.findOne({ email }).exec();
		if (userExist) {
			return res.status(400).send("Email Already Taken");
		}

		// hash password
		const hashedPassword = await hashPassword(password);

		// register
		const user = new User({
			name,
			email,
			password: hashedPassword
		});

		await user.save();
		console.log(user);

		return res.json({ ok: true });
	} catch (error) {
		console.log(error);
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		// console.log(req.body);
		const user = await User.findOne({ email }).exec();
		if (!user) {
			return res.status(400).send("No User Found");
		}

		// check Password
		const match = await comparePassword(password, user.password);

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d"
		});

		// return user and token to client exclude hashed password
		user.password = undefined;

		res.cookie("token", token, {
			httpOnly: true
		});

		// send user as json
		res.json(user);
	} catch (error) {
		console.log(error);
		return res.status(400).send("Error Try Again");
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie("token");
		return res.json({ msg: "Signout Success" });
	} catch (error) {
		console.log(error);
	}
};
