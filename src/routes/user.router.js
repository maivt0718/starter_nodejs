import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUser,
  updateUser,
  uploadAvarta,
} from "../controllers/user.controller.js";
import { upload } from "../../config/upload.js";
import { uploadCloud } from "../../config/uploadCloud.js";

// create object root router
const userRoutes = express.Router();

// userRoutes.post("/:id/:hoten", createUser)
userRoutes.get(`/get_all_user`, getAllUser)
userRoutes.get("/get_users", getUser);
userRoutes.delete("/delete_user/:user_id", deleteUser);
userRoutes.post("/create_user", createUser);
userRoutes.put("/update_user/:user_id", updateUser);
userRoutes.post("/upload_avarta", upload.single("picture"), uploadAvarta);
userRoutes.post(
  "/upload_avarta_cloud",
  uploadCloud.single("picture"),
  (req, res) => {
    let file = req.file;
    return res.status(200).json(file);
  }
);

export default userRoutes;
