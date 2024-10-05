import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret_key = process.env.JWT_SECRET;
const accessTokenTime = process.env.ACCESSTOKEN_EXPIRY_TIME;
const refreshTokenTime = process.env.REFRESHTOKEN_EXPIRY_TIME;

const createAccessToken = (user_id) => {
   return jwt.sign({ user_id }, secret_key, { expiresIn: accessTokenTime });
};

const createRefreshToken = (user_id) => {
   return jwt.sign({ user_id }, secret_key, { expiresIn: refreshTokenTime });
};

const verifyAccessToken = (req, res, next) => {
   const accessToken = req.cookies?.AccessToken;
   if (accessToken) {
      jwt.verify(accessToken, secret_key, (err, decoded) => {
         if (err) {
            return verifyRefreshToken(req, res, next);
         } else {
            req.user_id = decoded.user_id;
            if (!req.user_id) {
               return verifyRefreshToken(req, res, next);
            }
            return next();
         };
      });
   } else {
      return verifyRefreshToken(req, res, next);
   };
};

const verifyRefreshToken = (req, res, next) => {
   const refreshToken = req.cookies?.RefreshToken;
   if (refreshToken) {
      jwt.verify(refreshToken, secret_key, (err, decoded) => {
         if (err) {
            return res.status(401).send('Access denied. Invalid refresh token.');
         } else {
            const { user_id } = decoded;
            req.user_id = user_id;
            if (!req.user_id) {
               return res.status(401).send("User authentication failed");
            }
            const newAccessToken = createAccessToken(user_id);
            res.cookie("AccessToken", newAccessToken, {
               httpOnly: true,
               sameSite: 'none',
               secure: true,
               maxAge: 15 * 60 * 1000,
            });
            return next();
         };
      });
   } else {
      return res.status(401).send('Access denied. No refresh token provided.');
   };
};

export { createAccessToken, createRefreshToken, verifyAccessToken };