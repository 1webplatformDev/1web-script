const { createDropFun, createFun, createFunEnd, createFunMetaDataNotBegin } = require("../libs");
const { schemaAndTable, tableAlias, getAiColumn } = require("../../libs");

module.exports = {
    createFunCheckId(config) {
        let result = "\n\n";
        const name = "_check_id"
        const aiColumn = getAiColumn(config);
        result += createDropFun(config, name);
        result += createFun(config, name);
        result += `\tin _id int4,\n`;
        result += `\tout result_ json`;
        result += `\n)\n`;
        result += createFunMetaDataNotBegin();
        result += `\tdeclare\n`;
        result += `\t\tcheck_rows int;\n`;
        result += `\t\terror_id int = ${aiColumn["404_error"].id};\n`;
        result += `\tbegin\n`;
        result += `\t\tselect count(*) into check_rows from ${schemaAndTable(config)}_get_filter(_${aiColumn.name} => _id);\n`;
        result += `\t\tif check_rows = 0 then\n`;
        result += `\t\t\tselect * into result_ from public.create_error_ids(array[error_id], 404);\n`;
        result += `\t\tend if;`;
        result += createFunEnd();
        result += `\n\n`;
        return result;
    }
}