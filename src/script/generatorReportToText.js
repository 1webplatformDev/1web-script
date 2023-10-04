const fs = require("fs");
const dotenv = require('dotenv');
dotenv.config();

const { pathTemp } = require('../lib/defaultPathTemp');
const config = require("../../config/configReportToText.json")
const { randomString } = require('../lib/randomString');

const path_file = process.env.PATH_REPORT_TO_TEXT; // файл с текстом
const content = fs.readFileSync(path_file, 'utf8');

const result = { title: "", body: "" };

if (config.title) {
    for (const elem of config.title) {
        if (elem.match) {
            const reg = new RegExp(elem.match, 'gi');
            const arrayCmsId = content.match(reg);
            result.title += arrayCmsId.join(", ");
        }
        if (elem.text) {
            result.title += elem.text;
        }
    }
}

if (config.body) {
    for (const elem of config.body) {
        if (elem.fileContent) {
            result.body += content;
        }
    }
}
result.body = content;

const name = `report_${randomString(5)}.txt`;
fs.writeFileSync(`${pathTemp}\\${name}`, `${result.title}\n\n${result.body}`);