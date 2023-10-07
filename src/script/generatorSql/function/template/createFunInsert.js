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
        result += `    insert into ${schemaAndTable(config)} (${columnString(config.table.column)})`;
        result += `\n        values (${columnString(config.table.column, "_")})`;
        result += `\n        returning id into id_;`;
        result += createFunEnd();
        return result;
    }
}