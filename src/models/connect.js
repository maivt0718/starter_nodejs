import { Sequelize } from "sequelize";

// npx sequelize-auto -h localhost -d youtube_app -u root -x 123456 --dialect mysql -o src/models -l esm
const sequelize = new Sequelize(
    'youtube_app',
    'root',
    '123456',
    {
        host: "localhost",
        port: 3306,
        dialect: "mysql"
    }
)

export default sequelize

