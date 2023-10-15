const config = require("../../../config/generatorSql.json");
const { createTable, createSchema } = require("./table");
const { createTempFun } = require("./function");
const { createFile } = require("./createFile");
const { createDatasetError, getCommitFuction } = require("./libs");

let sql = "";
sql += `-- fun\n\n${getCommitFuction(config)}\n`;
sql += createSchema(config);
sql += createTable(config);
sql += createTempFun(config);
sql += createDatasetError(config);
createFile(sql, config.table.name);