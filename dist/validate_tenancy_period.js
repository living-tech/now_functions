"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTenancyPeriod = exports.getMinDay = exports.getMaxDay = exports.getMaxTenancyMonthCount = exports.getMinTenancyMonthCount = void 0;
const moment_1 = __importDefault(require("moment"));
const convert_tenancy_period_to_tenancy_term_1 = require("./convert_tenancy_period_to_tenancy_term");
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
        case now_enum_parser_1.TenancyTerm.MoreThanTwoYear:
            return 24;
        default:
            return 0;
    }
};
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
        case now_enum_parser_1.TenancyTerm.MoreThanOneYear:
            return 24;
        default:
            return null;
    }
};
exports.getMaxDay = (startMoment, tenancyTerm) => {
    const maxTenancyMonthCount = exports.getMaxTenancyMonthCount(tenancyTerm);
    if (maxTenancyMonthCount === null) {
        return null;
    }
    if (startMoment.format("D") === "1") {
        const nextSartMoment = startMoment
            .clone()
            .add(maxTenancyMonthCount, "months")
            .startOf("month");
        return nextSartMoment.diff(startMoment, "day") - 1;
    }
    const startLastMoment = startMoment.clone().endOf("month").startOf("day");
    const startMaxDays = startMoment.daysInMonth();
    const startUseDays = startLastMoment.diff(startMoment, "days") + 1;
    let nextMinDay = 0;
    for (let i = 0; i <= maxTenancyMonthCount; i += 1) {
        const targetMonthMoment = startMoment
            .clone()
            .add(i, "month")
            .startOf("month");
        const targetMaDays = targetMonthMoment.daysInMonth();
        if (i === 0) {
            nextMinDay += startUseDays;
        }
        else if (i === maxTenancyMonthCount) {
            nextMinDay += Math.ceil((1 - startUseDays / startMaxDays) * targetMaDays);
        }
        else {
            nextMinDay += targetMaDays;
        }
    }
    return nextMinDay - 2;
};
exports.getMinDay = (startMoment, tenancyTerm) => {
    if (tenancyTerm === now_enum_parser_1.TenancyTerm.LessThanOneMonth) {
        return 8;
    }
    const minTenancyMonthCount = exports.getMinTenancyMonthCount(tenancyTerm);
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
exports.validateTenancyPeriod = (tenancyPeriod, roomPlans) => {
    const targetTenancyTerm = convert_tenancy_period_to_tenancy_term_1.convertTenancyPeriodToTenancyTerm({
        startAt: tenancyPeriod.startAt,
        endAt: tenancyPeriod.endAt,
    });
    if (targetTenancyTerm === null) {
        return { hasPlan: false, endAtDetails: null };
    }
    const hasPlan = roomPlans.some((rp) => rp.tenancyTerm <= targetTenancyTerm);
    if (hasPlan === true) {
        return { hasPlan, endAtDetails: null };
    }
    const startMoment = moment_1.default(tenancyPeriod.startAt).startOf("day");
    const endAtDetails = roomPlans.map((roomPlan) => {
        const minDay = exports.getMinDay(startMoment.clone(), roomPlan.tenancyTerm);
        const maxDay = exports.getMaxDay(startMoment.clone(), roomPlan.tenancyTerm);
        return {
            tenancyTerm: roomPlan.tenancyTerm,
            minDay,
            maxDay,
            minDate: startMoment
                .clone()
                .add(minDay - 1, "days")
                .format("YYYY-MM-DD"),
            maxDate: maxDay !== null
                ? startMoment
                    .clone()
                    .add(maxDay - 1, "days")
                    .format("YYYY-MM-DD")
                : null,
        };
    });
    return { hasPlan, endAtDetails: hasPlan === false ? endAtDetails : null };
};
//# sourceMappingURL=validate_tenancy_period.js.map