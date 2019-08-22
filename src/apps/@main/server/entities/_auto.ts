import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize'
import { generateSchema } from '../../../../utils/db-schema-generator/mysql-schema-generator'
import { generateModels } from '../../../../utils/sequelize/sequelize-model-generator'
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
        .then((dbSchema) => {
            // console.log({ tables })
            type ModelStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Model)
            /*sequelize.define('skills', {
                // attributes
                name: {
                    type: DataTypes.STRING
                    // allowNull defaults to true
                },
                uuid: {
                    primaryKey: true,
                    type: DataTypes.STRING,
                },
            })*/
            generateModels(dbSchema, sequelize)
            const entity = sequelize.models.scaffolds as ModelStatic
            entity.findOne().then((skill: any) => console.log(skill.dataValues))
        })
}
