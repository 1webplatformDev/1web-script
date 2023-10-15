const { client } = require("../../lib/connectBd");
const { pathTemp } = require('../../lib/defaultPathTemp');
const fs = require("fs");

function generatorSqlInsert(table_name, aiName = "id") {
    const result = [];
    client.connect((err) => {
        client.query(`SELECT * from ${table_name} order by ${aiName}`, null, (err, res) => {
            for (const elem of res.rows) {
                result.push(createSqlInsert(table_name, elem));
            }
            createFile(result.join(";\n\n"), table_name);
            client.end()
        })
    })
}

function createSqlInsert(table_name, elem) {
    const column = [];
    const values = [];
    for (const key in elem) {
        column.push(key);
        if (typeof elem[key] == "string") {
            values.push(`'${elem[key]}'`);
        } else {
            values.push(elem[key]);
        }

    }
    return `insert into ${table_name}(${column.join(", ")})\noverriding system value values(${values.join(", ")})`;
}

const createFile = (textSql, table_name) => { // создания файла
    const name = `${table_name}-insert-generator.sql`;
    fs.writeFileSync(`${pathTemp}\\${name}`, textSql);
}

generatorSqlInsert("constuctor.type_component", "id");