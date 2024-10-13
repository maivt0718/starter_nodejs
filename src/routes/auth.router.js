import express from "express";
import { authAsyncKey, authLogin, authLoginFB, authRegister, extendToken, forgotPassword, renewPassword } from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/register", authRegister)
authRouter.post("/login", authLogin)
authRouter.post("/login-facebook", authLoginFB)
authRouter.post(`/extend-token`, extendToken)
authRouter.post(`/login-async-key`,authAsyncKey)
authRouter.post(`/forgotPassword`, forgotPassword)
authRouter.post(`/renewPassword`, renewPassword)

export default authRouter
