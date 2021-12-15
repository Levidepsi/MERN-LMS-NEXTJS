import User from "../model/users.js";
import { hashPassword, comparePassword } from "../utils/auth.js";
import jwt from "jsonwebtoken";
import asynchandler from "express-async-handler";
import cookie from "cookie";
import AWS from "aws-sdk";
// import { S3Client } from "@aws-sdk/client-s3";

// const REGION = "REGION";

// export const s3Client = new S3Client({ region: REGION });

const awsConfig = {
  accessKeyId: "AKIAQ4PUZ5AQ5XWP5P2J",
  secretAccessKey: "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",
  region: "us-east-2",
  apiVersion: "2010-12-01",
};
// console.log(awsConfig);
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

export const sendTestEmail = async (req, res) => {
  // console.log("send email using SES");
  // res.json({ ok: true });

  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: ["levidepsi7@gmail.com"],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
              <h1>Reset Password Link</h1>
              <p>Please use the following link to reset password</p>
            </html>
            `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password Reset Link",
      },
    },
  };
  SES.sendEmail(params)
    .promise()
    .then((data) => {
      console.log(data);
      res.json({ ok: true });
    })
    .catch((error) => {
      console.log(error);
    });

  // if (emailSent) {
  //   console.log(data);
  //   return res.json(data);
  // }
};
