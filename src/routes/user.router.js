import express from "express";
import { createUser, deleteUser, getUser } from "../controllers/user.controller.js";


// create object root router
const userRoutes = express.Router();

userRoutes.post("/:id/:hoten", createUser)
userRoutes.get("/get_users", getUser)
userRoutes.delete("/delete_user/:user_id", deleteUser)

export default userRoutes