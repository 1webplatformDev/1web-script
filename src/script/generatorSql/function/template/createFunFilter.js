const { createDropFun, createFun, createFunEnd, createFunMetaData } = require("../libs");
const { schemaAndTable, tableAlias } = require("../../libs");

const generatorInFunFilter = (config) => {
    let result = "";
    let sql_not_id = "";
    for (const column of config.table.column) {
        if (!column.key) {
            result += `\t_${column.name} ${column.type} = null,\n`;
        }
        if (column.ai) {
            sql_not_id = `\t_no${column.name} ${column.type} = null,\n`
        }

    }
    result += sql_not_id;
    result = result.slice(0, result.length - 2);
    return result;
}

const generatorWhere = (config) => {
    const tab = "\n\t\t\t";
    const alias_table_name = tableAlias(config);
    let result = `${tab}where (`;
    let index = -1;
    for (const column of config.table.column) {
        index++;

        if (column.key) {
            continue;
        }

        if (index != 0) {
            result += `${tab}and (`;
        }

        result += `${alias_table_name}.${column.name} = _${column.name} or _${column.name} is null)`;

        if (column.ai) {
            result += `${tab}and ${alias_table_name}.${column.name} <> _no_${column.name} or _no_${column.name} is null`;
        }
    }

    return `${result};`;
}

module.exports = {
    createFunFilter(config) {
        const tab = "\n\t\t\t";
        let result = "";
        const name = "_get_filter"
        const alias_table_name = tableAlias(config);
        result += createDropFun(config, name);
        result += createFun(config, name);
        result += generatorInFunFilter(config);
        result += `\n)\n`;
        result += `\treturns SETOF ${schemaAndTable(config)}\n`;
        result += createFunMetaData();
        result += `\t\treturn query ${tab}select * from ${schemaAndTable(config)} ${alias_table_name}`;
        result += generatorWhere(config);
        result += createFunEnd();
        result += `\n\n`;
        return result;
    }
}