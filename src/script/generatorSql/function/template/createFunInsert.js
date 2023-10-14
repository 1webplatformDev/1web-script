const { createDropFun, createFun, createFunEnd, createFunMetaData } = require("../libs");
const { columnString, schemaAndTable, createColumnParamsUi } = require("../../libs");

// автоматическое генерация out параметров функции insert
const generatorParamsOutInsert = () => {
    return `
    out id_ int,
    out result_ json`
}
// автоматическая генерация параметров in insert
const generatorAutoParamsInInsert = (config) => {
    let result = "";
    let result_last = "";
    for (const column of config.table.column) {

        if (column.ai || column.key) {
            continue;
        }
        if (!column["not-null"] && !column.default) {
            result_last += `\tin _${column.name} ${column.type} = null,\n`;
        } else if (!column["not-null"] && column.default) {
            result_last += `\tin _${column.name} ${column.type} = ${column.default},\n`;
        }
        else {
            result += `\tin _${column.name} ${column.type},\n`;
        }

    }
    result += result_last;
    result = result.slice(0, result.length - 1);
    return result;
}

module.exports = {
    createFunInsert(config) {
        let result = "";
        const name = "_insert"
        result += createDropFun(config, name);
        result += createFun(config, name);
        result += generatorAutoParamsInInsert(config);
        result += generatorParamsOutInsert();
        result += `\n)\n`;
        result += createFunMetaData();
        let tab = "\t\t";
        if (config.function_temp.check_ui) {
            result += `\t\tselect * into result_ from ${schemaAndTable(config)}_check_unieue(${createColumnParamsUi(config)});\n`;
            result += `\t\tif (result_::json->'status_result')::text::int = 200 then\n`;
            tab = "\t\t\t";
        }
        result += `${tab}insert into ${schemaAndTable(config)} (${columnString(config.table.column)})`;
        result += `\n${tab}values (${columnString(config.table.column, "_")})`;
        result += `\n${tab}returning id into id_;`;
        if (config.function_temp.check_ui) {
            result += `\n\t\tend if;`;
        }
        result += createFunEnd();
        return result;
    }
}