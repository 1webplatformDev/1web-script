const { createFunInsert } = require("./template/createFunInsert");
const { createFunUI } = require("./template/createFunUI");

module.exports = {
    // создания функции блок
    createTempFun: function (config) {
        let result = "";
        result += "\n-- function\n\n";

        if (config.function_temp.check_ui) {
            result += createFunUI(config);
        }

        if (config.function_temp.insert) {
            result += createFunInsert(config);
        }
        return result;
    }
}