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
    }
}