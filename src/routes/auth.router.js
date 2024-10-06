import express from "express";
import { authAsyncKey, authLogin, authLoginFB, authRegister } from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/register", authRegister)
authRouter.post("/login", authLogin)
authRouter.post("/login-facebook", authLoginFB)
authRouter.post(`/login-async-key`,authAsyncKey)

export default authRouter
