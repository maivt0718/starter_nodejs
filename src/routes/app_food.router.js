import express from 'express';
import { app_food_controller } from "../controllers/app_food.controller.js";

const app_food_router = express.Router()

app_food_router.get(`/getLikeList`, app_food_controller.likeProcessing)

export default app_food_router