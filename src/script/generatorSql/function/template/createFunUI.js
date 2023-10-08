const { createDropFun, createFun, createFunEnd, createFunMetaDataNotBegin } = require("../libs");

// автоматическая генерация параметров in на основе уникальных значении
const generatorAutoParamsInUi = (config) => {
    let result = "";
    for (const column of config.table.column) {
        if (column.ui) {
            result += `\tin _${column.name} ${column.type},\n`;
        }
        if (column.ai) {
            result += `\tin _${column.name} ${column.type} = null,\n`;
        }
    }
    result = result.slice(0, result.length - 2);
    return result;
}

//
const createDeclareUi = (config) => {
    let result = "\tdeclare\n";
    let result_error_var = "";
    for (const column of config.table.column) {
        if (column.ui) {
            result += `\t\tcount_${column.name} ${column.type};\n`;
            result_error_var += `\t\terror_id_${column.name} int = ${column.ui_error.id};\n`;
        }
    }
    result += result_error_var;
    result += "\t\terror_array int[];"
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
        result += createFunMetaDataNotBegin();
        result += createDeclareUi(config);
        result += "\t\nbegin\n";
        result += createFunEnd();
        result += `\n\n`;
        return result;
    }
}