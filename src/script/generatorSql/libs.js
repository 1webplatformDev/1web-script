module.exports = {
    schemaAndTable: function schemaAndTable(config) {
        return `${config.schema.name}.${config.table.name}`;
    },
    columnString(columns, pre_varchar) {
        let result = "";

        for (const column of columns) {

            if (column.name && !column.ai) {

                if (pre_varchar) {
                    result += `${pre_varchar}${column.name}, `;
                } else {
                    result += `${column.name}, `;
                }
            }
        }

        result = result.slice(0, result.length - 2);
        return result;
    },

    tableAlias(config) {
        const indexs = [0];
        let result = "";

        for (const index in config.table.name) {

            if (config.table.name[index] == "_") {
                indexs.push(+index + 1);
            }
        }

        for (const index of indexs) {
            result += config.table.name[index];
        }

        return result;
    },

    createDatasetError(config) {
        let result = "\n\n-- в файл public/error.sql\n";

        for (const column of config.table.column) {
            let ui_error;
            if (column.ui_error) {
                ui_error = column.ui_error;
            } else if (column["404_error"]) {
                ui_error = column["404_error"];
            }

            if (ui_error) {
                if (ui_error.name != null) {
                    ui_error.name = `'${ui_error.name}'`;
                }

                if (ui_error.description != null) {
                    ui_error.description = `'${ui_error.description}'`;
                }

                result += `insert into public.errors (id, "name", description, id_proekt, status)\n`;
                result += `overriding system value values (${ui_error.id}, ${ui_error.name}, ${ui_error.description}, ${ui_error.id_proekt}, ${ui_error.status});\n\n`;
            }

        }

        return result;
    },
    createColumnParamsUi(config) {
        let result = "";

        for (const column of config.table.column) {

            if (column.ai || column.key) {
                continue;
            }
            if (column.ui) {
                result += `_${column.name} => _${column.name}, `;
            }
        }

        result = result.slice(0, result.length - 2);
        return result;
    },
    getAiColumn(config) {
        return config.table.column.filter(column => column.ai)[0];
    }
}