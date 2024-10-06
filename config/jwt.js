import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { status } from "../const.js";
import fs from "fs";

dotenv.config();
let accessTokenPrivateKey = fs.readFileSync(
  `${process.env.BASE_KEY_PATH}/access_token.private.key`
);
let accessTokenPublicKey = fs.readFileSync(
  `${process.env.BASE_KEY_PATH}/access_token.public.key`
);
let refreshTokenPrivateKey = fs.readFileSync(
  `${process.env.BASE_KEY_PATH}/refresh_token.private.key`
);
let refreshTokenPublicKey = fs.readFileSync(
  `${process.env.BASE_KEY_PATH}/refresh_token.public.key`
);

export const createToken = (data) => {
  return jwt.sign({ payload: data }, process.env.ACCESS_TOKEN_KEY, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
};

export const createTokenAsyncKey = (data) => {
  return jwt.sign({ payload: data }, accessTokenPrivateKey, {
    algorithm: "RS256",
    expiresIn: "1d",
  });
};

export const createRefTokenAsyncKey = (data) => {
  return jwt.sign({ payload: data }, refreshTokenPrivateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
};

export const createRefToken = (data) => {
  return jwt.sign({payload: data}, process.env.REFRESH_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d"
  })
};

export const verifyToken = (token) => {
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

export const verifyTokenAsyncKey = (token) => {
  try {
    jwt.verify(token, accessTokenPublicKey);
    return true;
  } catch (error) {
    // không verify được token
    return false;
  }
};

// create middleware token
export const middlewareToken = (req, res, next) => {
  let { token } = req.headers;
  let checktoken = verifyToken(token);
  if (checktoken) {
    next();
  } else {
    return res.status(status.NOT_AUTHORISE).json({ message: `Unauthorised` });
  }
};

export const middlewareTokenAsyncKey = (req, res, next) => {
  let {token} = req.headers;
  let checkToken = verifyTokenAsyncKey(token);
  if (checkToken){
      // nếu token hợp lệ => pass => qua router
      next();
  } else {
      return res.status(401).json({message: "Unauthorized"});
  }
}