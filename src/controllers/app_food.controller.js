import initModelsAppFood from "../models/app_food/init-models.js";
import sequelizeAppFood from "../models/connect.js"

const models = initModelsAppFood(sequelizeAppFood)

export const app_food_controller = {
    likeProcessing: async (req, res, next) => {
        
    }
}