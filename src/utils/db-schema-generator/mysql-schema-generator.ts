import { getMatches } from '../string'
import { Dictionary } from '../types'
import { dataTypes } from './data-types'
import { DbField, DbRef, DbSchema, DbTable, DbType, DbTypeNames } from './db-schema'
const { String: STRING, Boolean: BOOL, Number: NUMBER, Date: DATE } = dataTypes

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

const getDataType = (dbType: string) => {
    const typeMatch: any = (/^(?<type>[^\(\)]+)(\((?<n1>\d+)(,(?<n2>\d+))?\))?/i).exec(dbType)
    const { type, n1, n2 } = typeMatch.groups
    const dataType: DbType = {
        name: typesMap[type.toLowerCase()],
        size: n1 && parseInt(n1),
        scale: n2 && parseInt(n2),
    }

    // Specific case for BIT type with size > 1
    if (dataType.name === BOOL && dataType.size && dataType.size > 1) {
        dataType.name = NUMBER as DbTypeNames
    }

    return dataType
}
export const generateSchema = async (execute: (sql: string) => Promise<any>, primayKey?: string) => {
    const tables = await Promise.all((await execute('show tables')).map(async (tableRow: object) => {
        const tableName = Object.values(tableRow)[0]
        const script = (await execute('SHOW CREATE TABLE `' + tableName + '`'))[0]['Create Table']

        const table: Partial<DbTable> = {
            children: [],
            name: tableName,
            parents: [],
            script,
        }

        const fieldsDict: Dictionary<DbField> = {};
        (await execute(`describe ${tableName}`)).reduce((dict: Dictionary<DbField>, { Field, Type, Null, Key }) => {
            dict[Field] = {
                name: Field,
                type: getDataType(Type),
                isNullable: Null.toLowerCase() === 'yes',
                isPrimary: Key.toLowerCase() === 'pri',
                table: table as DbTable
            }
            return dict
        }, fieldsDict)

        table.fields = fieldsDict

        return table
    }))

    // make dictionary of tables.
    const tablesDict: Dictionary<DbTable> = {}
    tables.reduce((dict: Dictionary<DbTable>, table: DbTable) => {
        dict[table.name] = table
        return dict
    }, tablesDict)

    // add references to tables.
    tables.forEach((table: DbTable) => {
        const { name, script } = table
        // tslint:disable-next-line: max-line-length
        const fkMatches = getMatches(script, /CONSTRAINT\s+`(?<fkName>[^`]+)`\s+FOREIGN KEY\s+\((?<fkFields>[^\)]+)\)\s+REFERENCES\s+`(?<parent>[^`]+)`\s+\((?<pkFields>[^\)]+)\)/ig)
        const fieldsRegex = /`([^`]+)`/ig
        fkMatches.forEach((fkMatch) => {
            const { fkName,
                    fkFields: fkFieldsString,
                    parent: parentTableName,
                    pkFields: pkFieldsString } = fkMatch.groups

            const parentTable = tablesDict[parentTableName]
            const fkFields = getMatches(fkFieldsString, fieldsRegex).map(([_, fldName]) => table.fields[fldName])
            const pkFields = getMatches(pkFieldsString, fieldsRegex).map(([_, fldName]) => parentTable.fields[fldName])
            const dbRef: DbRef = {
                child: table,
                fkFields,
                pkFields,
                name: fkName,
                parent: parentTable,
            }
            table.parents.push(dbRef)
            parentTable.children.push(dbRef)
        })
    })

    const dbSchema: DbSchema = {
        tables: tablesDict
    }

    return dbSchema

}
