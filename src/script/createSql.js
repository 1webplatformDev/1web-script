/**
 * Файл скрипт который изучает директиву указанную в .env PATH_WEB_SQL и на config configCreateSql создает 1 sql файл для отправки его в sql сервер
 */
const dotenv = require('dotenv');
dotenv.config();
const fs = require("fs");

const configCreateSql = require('../../config/configCreateSql.json');
const { randomString } = require('../lib/randomString');
const { pathTemp } = require('../lib/defaultPathTemp');

const PATH_WEB_SQL = process.env.PATH_WEB_SQL;
const PATH_TEMP_CREATE = process.env.PATH_TEMP_CREATE;

if (!PATH_WEB_SQL) { // без директивы до 1-web-sql не возможно создать файл
    throw new Error('Не указан путь к каталогу web-sql в файле .env');
}

const createSqlCode = () => { // чтения файлов по конфигу
    let textSql = "";
    configCreateSql.files_sql.forEach(file_sql => {
        const fileContent = fs.readFileSync(`${PATH_WEB_SQL}${file_sql}`, 'utf8');
        textSql += `${fileContent}\n`;
    })
    return textSql;
}

const createFile = () => { // создания файла sql
    const textSql = createSqlCode();
    const name = `all_${randomString(5)}.sql`;
    let paht_create = pathTemp;
    if (PATH_TEMP_CREATE) {
        paht_create = PATH_TEMP_CREATE;
    }

    fs.writeFileSync(`${paht_create}\\${name}`, textSql);
}

createFile();
