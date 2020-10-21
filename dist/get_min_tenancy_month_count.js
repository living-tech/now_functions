"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinTenancyMonthCount = void 0;
const now_enum_parser_1 = require("now-enum-parser");
exports.getMinTenancyMonthCount = (tenancyTerm) => {
    switch (tenancyTerm) {
        case now_enum_parser_1.TenancyTerm.OneToThreeMonths:
            return 1;
        case now_enum_parser_1.TenancyTerm.ThreeToSevenMonths:
            return 3;
        case now_enum_parser_1.TenancyTerm.SevenMonthsToOneYear:
            return 7;
        case now_enum_parser_1.TenancyTerm.MoreThanOneYear:
            return 12;
        default:
            return 0;
    }
};
//# sourceMappingURL=get_min_tenancy_month_count.js.map