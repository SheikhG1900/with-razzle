import { Sequelize } from 'sequelize'
import { generateSchema } from '../../../../utils/db-schema-generator/mysql-schema-generator'
export const sequelize = new Sequelize('mysql://root@localhost:3306/re_aw2')
export const testConnectivity = () => {
    console.log('testConnectivity')
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.')
        })
        .catch((err) => {
            console.error('Unable to connect to the database:', err)
        })
    generateSchema(async (sql) => sequelize.query(sql).then(([result]) => result))
        .then((tables) => {
            console.log({ tables })
        })
}
