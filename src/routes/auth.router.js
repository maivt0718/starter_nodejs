import express from "express";
import { authLogin, authLoginFB, authRegister } from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/register", authRegister)
authRouter.post("/login", authLogin)
authRouter.post("/login-facebook", authLoginFB)

export default authRouter
