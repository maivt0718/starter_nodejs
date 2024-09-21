import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    'node44',
    'root',
    '123456',
    {
        host: "localhost",
        port: 3306,
        dialect: "mysql"
    }
)

export default sequelize

