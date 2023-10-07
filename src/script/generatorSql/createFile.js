const dotenv = require('dotenv');
dotenv.config();
const fs = require("fs");

const { pathTemp } = require('../../lib/defaultPathTemp');
const { randomString } = require('../../lib/randomString');

module.exports = {
    createFile(text, name) {
        let generatorFile = randomString(5);

        if (name) {
            generatorFile = name;
        }
        
        const nameFile = `genetator_sql_${generatorFile}.sql`;
        fs.writeFileSync(`${pathTemp}\\${nameFile}`, text);
    }
}  