const { createDropFun, createFun, createFunEnd, createFunMetaData } = require("../libs");
const { schemaAndTable, createColumnParamsUi, getAiColumn } = require("../../libs");


const generatorAutoParamsUpdated = (config) => {
    let result = "";
    for (const column of config.table.column) {
        if (column.key) {
            continue;
        }
        result += `\tin _${column.name} ${column.type},\n`;
    }
    result += `\tout result_ json`;
    return result;
}

const generatorUpdateText = (config) => {
    let result = "";
    for (const column of config.table.column) {
        if (column.key || column.ai) {
            continue;
        }
        result += `${column.name} = _${column.name}, `;
    }
    result = result.slice(0, result.length - 2);
    return result;
}

module.exports = {
    createFunUpdated(config) {
        let result = "\n\n";
        const name = "_updated";
        const columnAi = getAiColumn(config);
        const aiName = columnAi.name;
        result += createDropFun(config, name);
        result += createFun(config, name);
        result += generatorAutoParamsUpdated(config);
        result += `\n)\n`;
        result += createFunMetaData();
        const paramsAiName = `_${aiName} => _${aiName}`;
        if (config.function_temp.check_id) {
            result += `\t\tselect * into result_ from ${schemaAndTable(config)}_check_id(_id => _${aiName});\n`;
            result += "\t\tif (result_::json->'status_result')::text::int = 404 then\n";
            result += "\t\t\treturn;\n";
            result += `\t\tend if;\n\n`;
        }

        if (config.function_temp.check_ui) {
            result += `\t\tselect * into result_ from ${schemaAndTable(config)}_check_unieue(${createColumnParamsUi(config)}, ${paramsAiName});\n`;
            result += `\t\tif (result_::json->'status_result')::text::int = 200 then\n`;
        }

        result += `\t\t\tupdate ${schemaAndTable(config)}\n`;
        result += `\t\t\tset ${generatorUpdateText(config)}\n`;
        result += `\t\t\twhere ${aiName} = _${aiName};\n`;
        if (config.function_temp.check_ui) {
            result += `\t\tend if;`;
        }
        result += createFunEnd();
        return result;
    }
};