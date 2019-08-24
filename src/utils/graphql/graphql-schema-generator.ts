import camelcase from 'camelcase'
import { GraphQLScalarType, Kind } from 'graphql'
import gql from 'graphql-tag'
import pluralize from 'pluralize'
import { BuildOptions, DataTypes, Model, Op, Sequelize } from 'sequelize'
import uppercamelcase from 'uppercamelcase'
import { listToDict } from '../array';
import { dataTypes } from '../db-schema-generator/data-types'
import { DbSchema } from '../db-schema-generator/db-schema'

type ModelStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Model)

// tslint:disable-next-line: variable-name
const { Boolean, Date: DateType, String, Number } = dataTypes

const typeMap = {
    Boolean,
    Date: DateType,
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

const fieldOpsDict = {
    AND_: { name: 'AND_', multi: true },
    NOT_: { name: 'NOT_', multi: true },
    OR_: { name: 'OR_', multi: true },
}

// tslint:disable: object-literal-sort-keys
const fieldValueOpsDict = {
    OR_: 'OR_',
    AND_: 'AND_',
    LIKE_: 'LIKE_',
    ILIKE_: 'ILIKE_',
    NLIKE_: 'NLIKE_',
    NILIKE_: 'NILIKE_',
    EQ_: 'EQ_',
    NE_: 'NE_',
    IN_: 'IN_',
    NOTIN_: 'NOTIN_',
    IS_: 'IS_',
    GT_: 'GT_',
    GTE_: 'GTE_',
    LT_: 'LT_',
    LTE_: 'LTE_',
    BETWEEN_: 'BETWEEN_',
    NOTBETWEEN_: 'NOTBETWEEN_',
}

const sequelizeFieldValueOpsMap = {
    [fieldValueOpsDict.OR_]: Op.or,
    [fieldValueOpsDict.AND_]: Op.and,
    [fieldValueOpsDict.LIKE_]: Op.like,
    [fieldValueOpsDict.ILIKE_]: Op.iLike,
    [fieldValueOpsDict.NLIKE_]: Op.notLike,
    [fieldValueOpsDict.NILIKE_]: Op.notILike,
    [fieldValueOpsDict.EQ_]: Op.eq,
    [fieldValueOpsDict.NE_]: Op.ne,
    [fieldValueOpsDict.IN_]: Op.in,
    [fieldValueOpsDict.NOTIN_]: Op.notIn,
    [fieldValueOpsDict.IS_]: Op.is,
    [fieldValueOpsDict.GT_]: Op.gt,
    [fieldValueOpsDict.GTE_]: Op.gte,
    [fieldValueOpsDict.LT_]: Op.lt,
    [fieldValueOpsDict.LTE_]: Op.lte,
    [fieldValueOpsDict.BETWEEN_]: Op.between,
    [fieldValueOpsDict.NOTBETWEEN_]: Op.notBetween,
}

const sequelizeFieldOpsMap = {
    [fieldOpsDict.AND_.name]: Op.and,
    [fieldOpsDict.NOT_.name]: Op.not,
    [fieldOpsDict.OR_.name]: Op.or
}

const toSequlizeFilter = (filter: object, advaced: boolean) => {
    const convertedFilter = { ...filter }
    Object.keys(convertedFilter).forEach((key) => {
        if (fieldOpsDict[key]) {
            convertedFilter[sequelizeFieldOpsMap[key]] =
                fieldOpsDict[key].multi ?
                    convertedFilter[key].map((f: object) => toSequlizeFilter(f, advaced)) :
                    toSequlizeFilter(convertedFilter[key], advaced)
            delete convertedFilter[key]
        } else if (advaced && convertedFilter[key]) {
            const fieldVal = convertedFilter[key]
            Object.keys(convertedFilter[key]).forEach((valOp) => {
                if (sequelizeFieldValueOpsMap[valOp]) {
                    fieldVal[sequelizeFieldValueOpsMap[valOp]] = fieldVal[valOp]
                    delete fieldVal[valOp]
                }
            })
        }
    })
    return convertedFilter
}

export const generateSchema = (dbSchema: DbSchema, sequelize: Sequelize) => {
    const modules = Object.values(dbSchema.tables).map((table) => {
        const fields = Object.values(table.fields).map((field) => {
            const { name, isPrimary, type } = field

            let mappedType = getMappedType(type.name)
            if (mappedType === typeMap.String && isPrimary) { mappedType = 'ID' }
            return { name, type: type.name, mappedType }
        })
        const fieldsWithType = fields.map((f) => `${f.name}: ${f.mappedType}`).join('\n')
        const fieldsWithAdvancedType = fields.map((f) => `${f.name}: ${f.type}Advanced`).join('\n')
        const tableType = pluralize.singular(uppercamelcase(table.name))
        const tableTypeInput = `${tableType}Input`
        const tableFindAllMethod = pluralize.plural(camelcase(table.name))

        const fieldOperators = Object.values(fieldOpsDict)
            .map((op) => op.multi ? `${op.name}: [${tableTypeInput}]` : `${op.name}: ${tableTypeInput}`)
            .join('\n')

        const fieldOperatorsAdvanced = Object.values(fieldOpsDict)
            .map((op) => op.multi ? `${op.name}: [${tableTypeInput}Advanced]` : `${op.name}: ${tableTypeInput}Advanced`)
            .join('\n')

        const typeDefs = gql`
            extend type Query {
                ${tableFindAllMethod}(
                    filter: ${tableTypeInput}
                    advancedFilter: ${tableTypeInput}Advanced): [${tableType}]
                ${tableFindAllMethod}Advanced(filter: ${tableTypeInput}Advanced): [${tableType}]
            }
            type ${tableType} {
                ${fieldsWithType}
            }
            input ${tableTypeInput} {
                ${fieldsWithType}
                ${fieldOperators}
            }
            input ${tableTypeInput}Advanced {
                ${fieldsWithAdvancedType}
                ${fieldOperatorsAdvanced}
            }`
        const resolvers = {
            Query: {
                [tableFindAllMethod]: async (_, { filter, advancedFilter }) => {
                    const model = sequelize.models[table.name] as ModelStatic
                    const rows = await model.findAll({
                        where: toSequlizeFilter(advancedFilter || filter, advancedFilter)
                    })
                    return rows
                }
            }
        }

        return { resolvers, typeDefs }
    }) as any

    const stringMappedType = getMappedType(String)
    const numberMappedType = getMappedType(Number)
    const dateMappedType = getMappedType(DateType)
    const booleanMappedType = getMappedType(Boolean)
    const commonModule = {
        resolvers: {
            Date: getDateType(),
        },
        typeDefs: gql`
            scalar Date
            input ${String}Advanced {
                OR_:  [${stringMappedType}]
                AND_: [${stringMappedType}]
                LIKE_: ${stringMappedType}
                ILIKE_: ${stringMappedType}
                NLIKE_: ${stringMappedType}
                NILIKE_: ${stringMappedType}
                EQ_: ${stringMappedType}
                NE_: ${stringMappedType}
                IN_:  [${stringMappedType}]
                NOTIN_: [${stringMappedType}]
                IS_: ${stringMappedType}
            }

            input ${Number}Advanced {
                OR_:  [${numberMappedType}]
                AND_: [${numberMappedType}]
                EQ_: ${numberMappedType}
                NE_: ${numberMappedType}
                IN_:  [${numberMappedType}]
                NOTIN_: [${numberMappedType}]
                GT_: ${numberMappedType}
                GTE_: ${numberMappedType}
                LT_: ${numberMappedType}
                LTE_: ${numberMappedType}
                IS_: ${numberMappedType}
                BETWEEN_: [${numberMappedType}]
                NOTBETWEEN_: [${numberMappedType}]
            }

            input ${Boolean}Advanced {
                EQ_: ${booleanMappedType}
                NE_: ${booleanMappedType}
                IS_: ${booleanMappedType}
            }

            input ${DateType}Advanced {
                OR_:  [${numberMappedType}]
                AND_: [${numberMappedType}]
                EQ_: ${numberMappedType}
                NE_: ${numberMappedType}
                IN_:  [${numberMappedType}]
                NOTIN_: [${numberMappedType}]
                GT_: ${numberMappedType}
                GTE_: ${numberMappedType}
                LT_: ${numberMappedType}
                LTE_: ${numberMappedType}
                IS_: ${numberMappedType}
                BETWEEN_: [${numberMappedType}]
                NOTBETWEEN_: [${numberMappedType}]
            }
            `
    }
    modules.push(commonModule)
    return modules
}
