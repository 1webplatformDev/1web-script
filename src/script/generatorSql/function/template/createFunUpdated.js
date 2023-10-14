const { createDropFun, createFun, createFunEnd, createFunMetaData } = require("../libs");
const { columnString, schemaAndTable } = require("../../libs");

module.exports = {
    createFunUpdated(config) {
        let result = "\n\n";
        const name = "_updated";
        result += createDropFun(config, name);
        result += createFun(config, name);
        return result;
    }
};