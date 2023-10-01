const config = require("../../config/generatorSql.json");

let sql = "";
let sql_column_comment = "";

function schemaAndTable(){
    return `${config.schema.name}.${config.table.name}`;
}

const createTable = () => {

    if (!config.table) {
        throw new Error("в конфиге не указан конфиг таблицы");
    }

    if (!config.table.name) {
        throw new Error("в конфиге не указано имя таблицы");
    }

    if (!config.table.column) {
        throw new Error("в конфиге не указан конфиг колонок");
    }

    sql += "-- Очистка\n\n";
    sql += `drop table if exists ${schemaAndTable()} cascade;\n`;
    sql += `-- ALTER SEQUENCE ${schemaAndTable()}_id_seq RESTART WITH 1;\n\n`;
    sql += `CREATE TABLE ${schemaAndTable()} (\n`;

    createColumn();
    sql += `\n\n--  comments\n`;
    if (config.table.comment) {
        sql += `comment on table ${schemaAndTable()} is '${config.table.comment}';\n\n`;
    }
    if(sql_column_comment){
        sql += sql_column_comment;
    }
}

const createSchema = () => {

    if (!config.schema) {
        throw new Error("в конфиге не указан конфиг схемы");
    }

    if (!config.schema.name) {
        throw new Error("в конфиге не указано имя схемы");
    }

    if (config.schema.new) {
        sql += `CREATE SCHEMA ${config.schema.name} AUTHORIZATION postgres; \n`
    }
}

const createColumn = () => {
    let index = -1;
    for (const column of config.table.column) {
        let column_sql = "";
        index++;

        if (column.key == "primary") {
            if (!column['name-column']) {
                throw new Error("в колонке первичный ключ не указан name column");
            }

            column_sql += `constraint ${config.table.name}_pk primary key (${column['name-column']})`;
            sql += `    ${column_sql}\n,`;
            continue;
        }

        column_sql = `${column.name} ${column.type}`;

        if (column.ai) {
            column_sql += " generated always as identity";
        }

        if (column["not-null"]) {
            column_sql += " not null";
        }

        if (column.default) {
            column_sql += ` default ${column.default}`
        }

        if (index < config.table.column.length - 1) {
            column_sql += ",";
        }

        if (column.comment) {
            column_sql += ` -- ${column.comment}`;
            sql_column_comment += `comment on column ${schemaAndTable()}.${column.name} is '${column.comment}';\n`;
        }
        sql += `    ${column_sql}\n`;
    }
    sql = sql.slice(0, sql.length - 2);
    sql += `\n)`;
}

createSchema();
createTable();

console.log(sql);