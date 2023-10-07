const config = require("../../../config/generatorSql.json");
const { createTable, createSchema } = require("./table");
const { createTempFun } = require("./function");
const { createFile } = require("./createFile");

let sql = "";
sql += createSchema(config);
sql += createTable(config);
sql += createTempFun(config);
createFile(sql, config.table.name);