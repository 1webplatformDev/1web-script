## .env возможные значения
- PATH_WEB_SQL - каталог 1web-sql проекта (обязателен для скрипта createSql.sql)
- PATH_TEMP_CREATE - каталог куда сохраняются созданные файлы и прочее (не обязателен по умолчанию как temp в проекте)
- PATH_REPORT_TO_TEXT - путь чтения файла для скрипта generatorReportToText.js

## Существующий скрипты в src/script
- createSql - создает 1 файл sql для заполнения sql сервера sql кода из каталога 1web-sql
- generatorSql.js - генерация sql на основе json
- generatorReportToText.js - генерация 
