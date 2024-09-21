import express from "express";
import userRoutes from "./user.router.js";

// create object root router
const rootRoutes = express.Router();

rootRoutes.use("/users", userRoutes)

export default rootRoutes