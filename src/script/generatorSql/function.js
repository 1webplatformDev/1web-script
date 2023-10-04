const { schemaAndTable } = require("./libs");

const createDropFun = (config, string) => {
    return `drop function if exists ${schemaAndTable(config)}${string};\n`;
}

const createFun = (config, string) => {
    return `create or replace function ${schemaAndTable(config)}${string}(\n`;
}

const createFunInsert = (config) => {
    let result = "";
    const name = "_insert"
    result += createDropFun(config, name);
    result += createFun(config, name);
    return result;
}

const generatorAutoParamsIn = (config) => {
    let result = "";

    for (const column of config.table.column) {

        if (column.ai || column.key) {
            continue;
        }

        result += `    in _${column.name} ${column.type},\n`;
    }

    result = result.slice(0, result.length - 2);
    result += "\n)\n";
    return result;
}



module.exports = {
    createTempFun: function (config) {
        let result = "";
        result += "\n-- function\n\n";
        result += createFunInsert(config);
        result += generatorAutoParamsIn(config);
        return result;
    }
}