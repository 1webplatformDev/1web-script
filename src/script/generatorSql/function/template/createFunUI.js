const { schemaAndTable, getAiColumn } = require("../../libs");
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

const generatorParamsIndexFilter = (config) => {
    const result = [];
    const columnsUi = config.table.column.filter((e) => e.ui);
    const columnsAiName = getAiColumn(config).name;
    for (const columnUi of columnsUi) {
        result.push({ params: "", name: columnUi.name });
        for (const column of config.table.column) {

            if (column.ui && column.name == columnUi.name) {
                result[result.length - 1].params += `_${column.name}, `;
                continue;
            }

            if (column.key) {
                continue;
            }
            result[result.length - 1].params += "null, ";
        }
        result[result.length - 1].params += `_${columnsAiName}`;
    }
    return result;
}

const funContent = (config) => {
    let result = "";
    const arrayParams = generatorParamsIndexFilter(config);
    let ifsBlock = "";
    for (const params of arrayParams) {
        result += `\n\t\tselect count(*) into count_${params.name} from ${schemaAndTable(config)}_get_filter(${params.params});`
        ifsBlock += `\t\tif count_${params.name} <> 0 then\n`;
        ifsBlock += `\t\t\terror_array = array_append(error_array, error_id_${params.name});\n`;
        ifsBlock += `\t\tend if;\n\n`;
    }
    result += `\n\n${ifsBlock}`;
    result += `\t\tif array_length(error_array, 1) <> 0 then\n`;
    result += `\t\t\tselect * into errors_ from public.create_error_ids(error_array, 400);\n`;
    result += `\t\t\treturn;\n`;
    result += `\t\tend if;\n`;
    result += `\n\t\tselect * into errors_ from public.create_error_json(null, 200);`;
    return result;
}

module.exports = {
    createFunUI(config) {
        let result = "";
        const name = "_check_unieue";
        result += createDropFun(config, name);
        result += createFun(config, name);
        result += generatorAutoParamsInUi(config);
        result += `\n\tout errors_ json`;
        result += `\n)\n`;
        result += createFunMetaDataNotBegin();
        result += createDeclareUi(config);
        result += "\n\tbegin";
        result += funContent(config);
        result += createFunEnd();
        result += `\n\n`;
        return result;
    }
}