const { schemaAndTable, columnString } = require("./libs");

const createDropFun = (config, string) => {
    return `drop function if exists ${schemaAndTable(config)}${string};\n`;
}

const createFun = (config, string) => {
    return `create or replace function ${schemaAndTable(config)}${string}(\n`;
}
const createFunEnd = () => {
    return `\n    end;
$function$;`;
}
const createFunMetaData = () => {
    return `    language  plpgsql
    as $function$
    begin
    `;
}
const generatorParamsOutInsert = () => {
    return `
    out id_ int,
    out result_ json`
}
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



module.exports = {
    createTempFun: function (config) {
        let result = "";
        result += "\n-- function\n\n";
        result += createFunInsert(config);
        return result;
    }
}