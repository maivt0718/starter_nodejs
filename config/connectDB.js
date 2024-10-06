import dotenv  from "dotenv";

dotenv.config()

export default {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    database: process.env.DB_DATABASE,
    database_app_food: process.env.DB_APP_FOOD,
    port: process.env.DB_PORT,
}