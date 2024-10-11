import { Sequelize } from "sequelize";
import configDB from '../../../config/connectDB.js'

// npx sequelize-auto -h localhost -d youtube_app -u root -x 123456 --dialect mysql -o src/models -l esm
// npx sequelize-auto -h localhost -d app_food -u root -x 123456 --dialect mysql -o src/models/app_food -l esm
const sequelizeAppFood = new Sequelize(
    configDB.database_app_food,
    configDB.user,
    configDB.pass,
    {
        host: configDB.host,
        port: configDB.port,
        dialect: configDB.dialect
    },
    
)

export default sequelizeAppFood;
