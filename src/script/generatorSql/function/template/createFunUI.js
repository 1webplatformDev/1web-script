const { createDropFun, createFun, createFunEnd, createFunMetaData } = require("../libs");

// автоматическая генерация параметров in на основе уникальных значении
const generatorAutoParamsInUi = (config) => {
    let result = "";
    for (const column of config.table.column) {
        if (column.ui) {
            result += `    in _${column.name} ${column.type},\n`;
        }
        if (column.ai) {
            result += `    in _${column.name} ${column.type} = null,\n`;
        }
    }
    result = result.slice(0, result.length - 2);
    return result;
}

module.exports = {
    createFunUI(config) {
        let result = "";
        const name = "_check_unieue";
        result += createDropFun(config, name);
        result += createFun(config, name);
        result += generatorAutoParamsInUi(config);
        result += `\n)\n`;
        result += createFunMetaData();
        result += createFunEnd();
        result += `\n\n`;
        return result;
    }
}