import camelcase from 'camelcase'
import { GraphQLScalarType, Kind } from 'graphql'
import gql from 'graphql-tag'
import pluralize from 'pluralize'
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize'
import uppercamelcase from 'uppercamelcase'
import { dataTypes  } from '../db-schema-generator/data-types'
import { DbSchema } from '../db-schema-generator/db-schema'

type ModelStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Model)

// tslint:disable-next-line: variable-name
const { Boolean, Date, String } = dataTypes

const typeMap = {
    Boolean,
    Date,
    Number: 'Float',
    String,
}

const getMappedType = (fromType: string) => {
    return typeMap[fromType]
}

const getDateType = () => new GraphQLScalarType({
    description: 'Date custom scalar type',
    name: 'Date',
    parseValue(value) {
        return new Date(value) // value from the client
    },
    serialize(value) {
        return value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(ast.value) // ast value is always in string format
        }
        return null
    },
})

export const generateSchema = (dbSchema: DbSchema, sequelize: Sequelize) => {
    const modules = Object.values(dbSchema.tables).map((table) => {
        const fields = Object.values(table.fields).map((field) => {
            const { name, isPrimary, type } = field

            let mappedType = getMappedType(type.name)
            if (mappedType === typeMap.String && isPrimary) { mappedType = 'ID' }
            return `${name}: ${mappedType}`
        }).join('\n')
        const tableType = pluralize.singular(uppercamelcase(table.name))
        const tableTypeInput = `${tableType}Input`
        const tableFindAllMethod = pluralize.plural(camelcase(table.name))
        const typeDefs = gql`
            extend type Query {
                ${tableFindAllMethod}(filter: ${tableTypeInput}): [${tableType}]
            }
            type ${tableType} {
                ${fields}
            }
            input ${tableTypeInput} {
                ${fields}
            }`
        const resolvers = {
            Query: {
                [tableFindAllMethod]: async (_, { filter }) => {
                    const model = sequelize.models[table.name] as ModelStatic
                    const rows = await model.findAll({ where: filter })
                    return rows
                }
            }
        }

        return { resolvers, typeDefs }
    }) as any

    const commonModule = {
        resolvers: {
            Date: getDateType(),
        },
        typeDefs: gql`
            scalar Date
            `
    }
    modules.push(commonModule)
    return modules
}
