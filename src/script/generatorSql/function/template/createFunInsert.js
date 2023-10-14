const { createDropFun, createFun, createFunEnd, createFunMetaData } = require("../libs");
const { columnString, schemaAndTable } = require("../../libs");

// автоматическое генерация out параметров функции insert
const generatorParamsOutInsert = () => {
    return `
    out id_ int,
    out result_ json`
}
// автоматическая генерация параметров in insert
const generatorAutoParamsInInsert = (config) => {
    let result = "";

    for (const column of config.table.column) {

        if (column.ai || column.key) {
            continue;
        }

        result += `    in _${column.name} ${column.type},\n`;
    }

    result = result.slice(0, result.length - 2);
    return result;
}

// автоматическая генерация параметров in insert
const generatorCheckUnieueParams = (config) => {
    let result = "";

    for (const column of config.table.column) {

        if (column.ai || column.key) {
            continue;
        }
        if (column.ui) {
            result += `${column.name}, `;
        }
    }

    result = result.slice(0, result.length - 2);
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
            result += `\t\tselect * into result_ from ${schemaAndTable(config)}_check_unieue(${generatorCheckUnieueParams(config)});\n`;
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