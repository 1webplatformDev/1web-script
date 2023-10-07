const { config } = require("dotenv");
const { schemaAndTable, columnString } = require("./libs");
const table = require("./table");
// удаление функции
const createDropFun = (config, string) => {
    return `drop function if exists ${schemaAndTable(config)}${string};\n`;
}

// начало создания функции
const createFun = (config, string) => {
    return `create or replace function ${schemaAndTable(config)}${string}(\n`;
}

// конец создания функции
const createFunEnd = () => {
    return `\n    end;
$function$;`;
}

// хардкодная часть функции
const createFunMetaData = () => {
    return `    language  plpgsql
    as $function$
    begin
    `;
}

// автоматическое генерация out параметров функции insert
const generatorParamsOutInsert = () => {
    return `
    out id_ int,
    out result_ json`
}

// создание функции insert
const createFunInsert = (config) => {
    let result = "";
    const name = "_insert"
    result += createDropFun(config, name);
    result += createFun(config, name);
    result += generatorAutoParamsIn(config);
    result += generatorParamsOutInsert();
    result += `\n)\n`;
    result += createFunMetaData();
    result += `    insert into ${schemaAndTable(config)} (${columnString(config.table.column)})`;
    result += `\n        values (${columnString(config.table.column, "_")})`;
    result += `\n        returning id into id_;`;
    result += createFunEnd();
    return result;
}
const createFunUI = (config) => {
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

// автоматическая генерация параметров in
const generatorAutoParamsIn = (config) => {
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
    // создания функции блок
    createTempFun: function (config) {
        let result = "";
        result += "\n-- function\n\n";

        if (config.function_temp.check_ui) {
            result += createFunUI(config);
        }

        if (config.function_temp.insert) {
            result += createFunInsert(config);
        }
        return result;
    }
}