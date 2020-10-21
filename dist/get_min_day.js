"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinDay = void 0;
const now_enum_parser_1 = require("now-enum-parser");
const get_min_tenancy_month_count_1 = require("./get_min_tenancy_month_count");
exports.getMinDay = (startMoment, tenancyTerm) => {
    if (tenancyTerm === now_enum_parser_1.TenancyTerm.LessThanOneMonth) {
        return 7;
    }
    const minTenancyMonthCount = get_min_tenancy_month_count_1.getMinTenancyMonthCount(tenancyTerm);
    if (startMoment.format("D") === "1") {
        const endMoment = startMoment
            .clone()
            .add(minTenancyMonthCount, "months")
            .startOf("month")
            .add(-1, "day");
        return endMoment.diff(startMoment, "day") + 1;
    }
    const startLastMoment = startMoment.clone().endOf("month").startOf("day");
    const startMaxDays = startMoment.daysInMonth();
    const startUseDays = startLastMoment.diff(startMoment, "days");
    let minDayCount = 0;
    for (let i = 0; i <= minTenancyMonthCount; i += 1) {
        const targetMonthMoment = startMoment
            .clone()
            .add(i, "month")
            .startOf("month");
        const targetMaDays = targetMonthMoment.daysInMonth();
        if (i === 0) {
            minDayCount += startUseDays;
        }
        else if (i === minTenancyMonthCount) {
            minDayCount += Math.ceil((1 - startUseDays / startMaxDays) * targetMaDays);
        }
        else {
            minDayCount += targetMaDays;
        }
    }
    return minDayCount;
};
//# sourceMappingURL=get_min_day.js.map