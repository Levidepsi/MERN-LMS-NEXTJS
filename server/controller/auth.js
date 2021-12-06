import User from "../model/users.js";
import { hashPassword, comparePassword } from "../utils/auth.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.status(400).send("Name is required");

    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be 6 characters");
    }

    const userExist = await User.findOne({ email }).exec();
    if (userExist) {
      return res.status(400).send("Email is taken");
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    console.log(user);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) return res.status(400).send("No User Found");

    const match = await comparePassword(password, user.password);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7day",
    });
    user.password = undefined;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};
