"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxTenancyMonthCount = void 0;
const now_enum_parser_1 = require("now-enum-parser");
exports.getMaxTenancyMonthCount = (tenancyTerm) => {
    switch (tenancyTerm) {
        case now_enum_parser_1.TenancyTerm.LessThanOneMonth:
            return 1;
        case now_enum_parser_1.TenancyTerm.OneToThreeMonths:
            return 3;
        case now_enum_parser_1.TenancyTerm.ThreeToSevenMonths:
            return 7;
        case now_enum_parser_1.TenancyTerm.SevenMonthsToOneYear:
            return 12;
        default:
            return null;
    }
};
//# sourceMappingURL=get_max_tenancy_month_count.js.map