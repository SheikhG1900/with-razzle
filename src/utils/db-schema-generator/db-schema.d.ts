import { dataTypes } from "./data-types";
import { isNull } from "util";
import { Dictionary } from "../types";

export type DbTypeNames = keyof typeof dataTypes
export interface DbType {
    name: DbTypeNames
    size?: number
    scale?: number
}

export interface DbField {
    name: string
    type: DbType
    isNull: boolean
    isPrimary: boolean
    table: DbTable
}
export interface DbRef {
    name: string
    pkFields: DbField[]
    fkFields: DbField[]
    parent: DbTable
    child: DbTable
}
export interface DbTable {
    fields: Dictionary<DbField>
    name: string
    script: string
    parents: DbRef[]
    children: DbRef[]
}
