import express from 'express';
import { app_food_controller } from "../controllers/app_food.controller.js";

const app_food_router = express.Router()

app_food_router.get(`/getLikeListbyRestaurant`, app_food_controller.likeProcessingByRestaurant)
app_food_router.get(`/getLikeListbyUser`, app_food_controller.likeProcessingByUser)
app_food_router.get(`/getDislikeListbyUser`, app_food_controller.DislikeByUser)
app_food_router.get(`/feedback`, app_food_controller.updateFeedback)
app_food_router.get(`/getRateByRes`, app_food_controller.getListResRate)
app_food_router.get(`/getRateByUser`, app_food_controller.getListRatebyUser)
app_food_router.get(`/addFood`, app_food_controller.addFood)

export default app_food_router