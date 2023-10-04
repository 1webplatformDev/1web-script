const config = require("../../../config/generatorSql.json");
const { createTable, createSchema } = require("./table");
const { createTempFun } = require("./function");

let sql = "";
sql += createSchema(config);
sql += createTable(config);
sql += createTempFun(config);

console.log(sql);