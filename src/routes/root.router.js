import express from "express";
import userRoutes from "./user.router.js";
import videoRouter from "./video.router.js";
import authRouter from "./auth.router.js";
import app_food_router from "./app_food.router.js";

// create object root router
const rootRoutes = express.Router();

rootRoutes.use("/users", userRoutes)
rootRoutes.use("/videos", videoRouter)
rootRoutes.use("/auth", authRouter)
rootRoutes.use("/appFood", app_food_router)

export default rootRoutes