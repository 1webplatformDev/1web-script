const { schemaAndTable } = require("../libs");
module.exports = {
    // удаление функции
    createDropFun(config, string) {
        return `drop function if exists ${schemaAndTable(config)}${string};\n`;
    },

    // начало создания функции
    createFun(config, string) {
        return `create or replace function ${schemaAndTable(config)}${string}(\n`;
    },

    // конец создания функции
    createFunEnd() {
        return `\n\tend;\n\t$function$;`;
    },

    // хардкодная часть функции
    createFunMetaData() {
        return `\tlanguage plpgsql\n\tas $function$\n\tbegin\n`;
    },
    // хардкодная часть функции
    createFunMetaDataNotBegin() {
        return `\tlanguage plpgsql\n\tas $function$\n`;
    }
}
