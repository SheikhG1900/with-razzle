import { dataTypes } from '../db-schema-generator/data-types'
const { STRING, BOOL, NUMBER, DATE } = dataTypes

// tslint:disable: object-literal-sort-keys
const typesMap = {
    // String types
    char: STRING,
    varchar: STRING,
    text: STRING,
    longtext: STRING,
    mediumtext: STRING,
    tinytext: STRING,
    binary: STRING,
    varbinary: STRING,
    blob: STRING,
    longblob: STRING,
    mediumblob: STRING,
    tinyblob: STRING,
    enum: STRING,
    set: STRING,

    // boolean type
    bit: BOOL,
    bool: BOOL,
    boolean: BOOL,

    // Numeric type
    integer: NUMBER,
    int: NUMBER,
    bigint: NUMBER,
    mediumint: NUMBER,
    smallint: NUMBER,
    float: NUMBER,
    double: NUMBER,
    decimal: NUMBER,
    dec: NUMBER,

    // Date type
    date: DATE,
    datetime: DATE,
    timestamp: DATE,
    time: DATE,

}

const getDataType = (dbType) => {
    const { type, n1, n2 } = dbType.match(/^(?<type>[^\(\)]+)(\((?<n1>\d+)(,(?<n2>\d+))?\))?/i).groups
    const dataType = {
        name: typesMap[type.toLowerCase()],
        size: n1 && parseInt(n1),
        scale: n2 && parseInt(n2),
    }

    // Specific case for BIT type with size > 1
    if (dataType.name === BOOL && dataType.size > 1) {
        dataType.name = NUMBER
    }

    return dataType
}
export const generateSchema = async (execute: (sql: string) => Promise<any>, primayKey?: string) => {
    const tables = await Promise.all((await execute('show tables')).map(async (tableRow: object) => {
        const tableName = Object.values(tableRow)[0]
        const createScripts = (await execute('SHOW CREATE TABLE `' + tableName + '`'))[0]['Create Table']

        const table = {
            name: tableName,
            createScripts
        }

        const columnsDict = {};
        (await execute(`describe ${tableName}`)).reduce((dict: object, { Field, Type, Null, Key }) => {
            dict[Field] = {
                name: Field,
                type: getDataType(Type),
                isNull: Null.toLowerCase() === 'yes',
                isPrimary: Key.toLowerCase() === 'pri',
                table
            }
            return dict
        }, columnsDict)

        table.columns = columnsDict

        return table
    }))

    const tablesDict = {}
    tables.reduce((dict: object, table: object) => {
        dict[table.name] = table
        return dict
    }, tablesDict)

    return tablesDict

}
