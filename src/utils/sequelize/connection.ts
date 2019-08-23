import { Sequelize } from 'sequelize'
import { generateSchema } from '../../utils/db-schema-generator/mysql-schema-generator'
import { generateModels } from './sequelize-model-generator'
export const connect = async (connString: string) => {
    const sequelize = new Sequelize(connString)
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')

        // generate schema
        const dbSchema = await generateSchema(async (sql: string) => sequelize.query(sql).then(([result]) => result))

        // generate squelize model
        generateModels(dbSchema, sequelize)

        return { sequelize, dbSchema }
    } catch (err) {
        console.error('Unable to connect to the database:', err)
    }
}
