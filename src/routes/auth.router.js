import express from "express";
import { authAsyncKey, authLogin, authLoginFB, authRegister, extendToken } from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/register", authRegister)
authRouter.post("/login", authLogin)
authRouter.post("/login-facebook", authLoginFB)
authRouter.post(`/login-async-key`,authAsyncKey)

authRouter.post("/extend-token", extendToken);
authRouter.get("/verify-token-async-key", verifyAccessTokenAsyncKey);

export default authRouter
