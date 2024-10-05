import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { status } from "../const.js";

dotenv.config();

export const createToken = (data) => {
  return jwt.sign({ payload: data }, process.env.ACCESS_TOKEN_KEY, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
};

const verifyToken = (token) => {
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
        return true
    } catch (error) {
        return false
    }
}

// create middleware token
export const middlewareToken = (req, res, next) => {
    let {token} = req.headers
    let checktoken = verifyToken(token)
    if(checktoken){
        next()
    }
    else{
        return res.status(status.NOT_AUTHORISE).json({message: `Unauthorised`})
    }
}
