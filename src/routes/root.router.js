import express from "express";
import userRoutes from "./user.router.js";
import videoRouter from "./video.router.js";
import authRouter from "./auth.router.js";

// create object root router
const rootRoutes = express.Router();

rootRoutes.use("/users", userRoutes)
rootRoutes.use("/videos", videoRouter)
rootRoutes.use("/auth", authRouter)

export default rootRoutes