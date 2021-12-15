import jwt from "jsonwebtoken";

export const requireSignin = async (req, res, next) => {
  let token;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      req.user = jwt.verify(token, `${process.env.JWT_SECRET}`);
      next();
    } catch (error) {
      console.log(error);
    }
  }
};
