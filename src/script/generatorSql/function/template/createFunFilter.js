const { createDropFun, createFun, createFunEnd, createFunMetaData } = require("../libs");

const generatorInFunFilter = (config) => {
    let result = "";
    let sql_not_id = "";
    for (const column of config.table.column) {
        if (!column.key) {
            result += `    _${column.name} ${column.type} = null,\n`;
        }
        if (column.ai) {
            sql_not_id = `    _no${column.name} ${column.type} = null,\n`
        }

    }
    result += sql_not_id;
    result = result.slice(0, result.length - 2);
    return result;
}

module.exports = {
    createFunFilter(config) {
        let result = "";
        const name = "_get_filter"
        result += createDropFun(config, name);
        result += createFun(config, name);
        result += generatorInFunFilter(config);
        result += `\n)\n`;
        result += createFunMetaData();
        result += createFunEnd();
        result += `\n\n`;
        return result;
    }
}