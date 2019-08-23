import { DataTypes, Sequelize } from 'sequelize'
import { DbSchema } from '../db-schema-generator/db-schema'
const typeMap = {
    Boolean: DataTypes.BOOLEAN,
    Date: DataTypes.DATE,
    Number: DataTypes.NUMBER,
    String: DataTypes.STRING,
}

const getMappedType = (fromType: string) => {
    return typeMap[fromType]
}

export const generateModels = (dbSchema: DbSchema, sequelize: Sequelize) => {
    Object.values(dbSchema.tables).forEach((table) => {
        const attributes = {}
        Object.values(table.fields).reduce((atbs: any, field) => {
            const { name, isNullable, isPrimary, type } = field
            try {
                atbs[name] = {
                    allowNull: isNullable,
                    primaryKey: isPrimary,
                    type: getMappedType(type.name),
                }
            } catch (ex) {
                console.error(`table Name: ${table.name}, field Name: ${name} failed`)
                console.error(ex)
                console.log({ table, field })
            }
            return atbs
        }, attributes)
        sequelize.define(table.name, attributes)
    })
}