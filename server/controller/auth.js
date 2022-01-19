import User from "../model/users.js";
import { hashPassword, comparePassword } from "../utils/auth.js";
import jwt from "jsonwebtoken";
import asynchandler from "express-async-handler";
import cookie from "cookie";
import { nanoid } from "nanoid";
import AWS from "aws-sdk";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: process.env.REGION,
  apiVersion: process.env.API_VERSION,
};
const SES = new AWS.SES(awsConfig);

export const register = asynchandler(async (req, res) => {
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
});

export const login = asynchandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) return res.status(400).send("No User Found");

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong Password");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7day",
    });
    user.password = undefined;

    res.setHeader("Set-Cookie", cookie.serialize("token", token), {
      httpOnly: true,
    });
    console.log(user);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout Success" });
  } catch (error) {
    console.log(error);
  }
};

export const currentUser = asynchandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    });
    // res.send("Current User");
  } catch (error) {
    console.log(error);
  }
});

export const forgotPassword = asynchandler(async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) return res.status(400).send("User not found");

    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
                <h1>Reset Password</h1>
                <p>Use this code to reset your password</p>
                <h2 style='color:red; '>${shortCode}</h2>
                <i>edemy.com</i>
              </html>
            `,
          },
        },
        Subject: { Charset: "UTF-8", Data: "RESET PASSWORD" },
      },
    };

    const emailSent = SES.sendEmail(params).promise();

    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
});

export const resetPassword = asynchandler(async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    // console.table({ email, code, newPassword });
    const hashedPassword = await hashPassword(newPassword);
    const user = User.findOneAndUpdate(
      { email, passwordResetCode: code },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error try again");
  }
});
