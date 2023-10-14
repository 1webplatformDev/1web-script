const { schemaAndTable } = require("./libs")

const createColumn = (config) => {
    let result = ""; // результат функции
    let sql_column_comment = ""; // результат функции комментарии
    let sql_ui = "";
    let index = -1;

    for (const column of config.table.column) {
        let column_sql = ""; // генерация 1 колонки
        index++;

        if (column.key == "primary") {
            if (!column['name-column']) {
                throw new Error("в колонке первичный ключ не указан name column");
            }

            column_sql += `constraint ${config.table.name}_pk primary key (${column['name-column']})`;
            result += `\t${column_sql}\n,`;
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

        if (column.ui) {
            sql_ui += `create unique index ${config.table.name}_${column.name}_idx on ${schemaAndTable(config)} using btree (${column.name});\n`;
        }

        if (column.comment) {
            column_sql += ` -- ${column.comment}`;
            sql_column_comment += `comment on column ${schemaAndTable(config)}.${column.name} is '${column.comment}';\n`;
        }
        result += `    ${column_sql}\n`;
    }
    result = result.slice(0, result.length - 2);
    result += `\n);`;
    return { result, sql_column_comment, sql_ui };
}

module.exports = {
    createTable(config) {
        let result = "";
        if (!config.table) {
            throw new Error("в конфиге не указан конфиг таблицы");
        }

        if (!config.table.name) {
            throw new Error("в конфиге не указано имя таблицы");
        }

        if (!config.table.column) {
            throw new Error("в конфиге не указан конфиг колонок");
        }

        result += "-- Очистка\n\n";
        result += `drop table if exists ${schemaAndTable(config)} cascade;\n`;
        result += `-- alter sequence ${schemaAndTable(config)}_id_seq restart with 1;\n\n`;
        result += `create table ${schemaAndTable(config)} (\n`;

        const { result: result_column, sql_column_comment, sql_ui } = createColumn(config);
        result += result_column;
        if (sql_ui) {
            result += `\n\n${sql_ui}`;
        }
        result += `\n--  comments\n`;

        if (config.table.comment) {
            result += `comment on table ${schemaAndTable(config)} is '${config.table.comment}';\n\n`;
        }

        if (sql_column_comment) {
            result += sql_column_comment;
        }
        return result;
    },
    createSchema(config) {
        if (!config.schema) {
            throw new Error("в конфиге не указан конфиг схемы");
        }

        if (!config.schema.name) {
            throw new Error("в конфиге не указано имя схемы");
        }

        if (config.schema.new) {
            return `CREATE SCHEMA ${config.schema.name} AUTHORIZATION postgres; \n`
        }

        return "";
    }
}