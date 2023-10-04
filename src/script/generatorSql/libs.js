module.exports = {
    schemaAndTable: function schemaAndTable(config) {
        return `${config.schema.name}.${config.table.name}`;
    }
}