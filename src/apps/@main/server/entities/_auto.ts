import { BuildOptions, DataTypes, Model, Sequelize, Op } from 'sequelize'
import { generateSchema } from '../../../../utils/db-schema-generator/mysql-schema-generator'
import { generateModels } from '../../../../utils/sequelize/sequelize-model-generator'
export const sequelize = new Sequelize('mysql://root@localhost:3306/re_aw2')
export const intialize = () => {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.')
        })
        .catch((err) => {
            console.error('Unable to connect to the database:', err)
        })

    generateSchema(async (sql) => sequelize.query(sql).then(([result]) => result))
        .then((dbSchema) => {
            // console.log({ tables })
            type ModelStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Model)
            generateModels(dbSchema, sequelize)
            const entity = sequelize.models.skills as ModelStatic
            entity.findAll({ where: { [Op.or]: [{ name: 'java' }, { name: 'python' }] } })
                .then((models: any[]) => models.forEach((model: any) => console.log(model.dataValues)))
        })
}
