import { Sequelize } from "sequelize";
import configDB from '../../config/connectDB.js'

// npx sequelize-auto -h localhost -d youtube_app -u root -x 123456 --dialect mysql -o src/models -l esm
const sequelize = new Sequelize(
    configDB.database,
    configDB.user,
    configDB.pass,
    {
        host: configDB.host,
        port: configDB.port,
        dialect: configDB.dialect
    }
)

export default sequelize

