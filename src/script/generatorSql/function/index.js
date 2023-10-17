const { createFunInsert } = require("./template/createFunInsert");
const { createFunUI } = require("./template/createFunUI");
const { createFunFilter } = require("./template/createFunFilter");
const { createFunUpdated } = require("./template/createFunUpdated");
const { createFunCheckId } = require("./template/createFunCheckId");
module.exports = {
    // создания функции блок
    createTempFun: function (config) {
        let result = "";
        result += "\n-- function\n\n";

        if (config.function_temp.filter) {
            result += createFunFilter(config);
        }
        
        if (config.function_temp.check_ui) {
            result += createFunUI(config);
        }

        if (config.function_temp.insert) {
            result += createFunInsert(config);
        }
        
        if (config.function_temp.updated) {
            result += createFunUpdated(config);
        }
        if (config.function_temp.check_id) {
            result += createFunCheckId(config);
        }
        return result;
    }
}