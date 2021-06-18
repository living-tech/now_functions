"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTenancyPeriodToTenancyTerm = void 0;
const moment_1 = __importDefault(require("moment"));
const now_enum_parser_1 = require("now-enum-parser");
const count_use_days_1 = require("./count_use_days");
/**
 * 入居日と退去日からプランを出す
 * 該当するプランがなければnullを返す
 */
exports.convertTenancyPeriodToTenancyTerm = (tenancyPeriod) => {
    const startMoment = moment_1.default(tenancyPeriod.startAt).startOf("day");
    const endMoment = moment_1.default(tenancyPeriod.endAt).startOf("day");
    const allUseDays = count_use_days_1.countUseDays({
        startAt: tenancyPeriod.startAt,
        endAt: tenancyPeriod.endAt,
    });
    if (!startMoment.isValid() ||
        !endMoment.isValid() ||
        startMoment.isAfter(endMoment) ||
        allUseDays === null ||
        allUseDays < 8) {
        return null;
    }
    let useMonths = 0;
    if (startMoment.isSame(endMoment, "month")) {
        const daysInMonth = startMoment.daysInMonth();
        const useDays = endMoment.diff(startMoment, "days") + 1;
        useMonths += useDays / daysInMonth;
    }
    else {
        let targetMonthMoment = startMoment.clone().startOf("month");
        while (targetMonthMoment.isSameOrBefore(endMoment, "month")) {
            const daysInMonth = targetMonthMoment.daysInMonth();
            let useDays = daysInMonth;
            if (targetMonthMoment.isSame(startMoment, "month")) {
                useDays =
                    targetMonthMoment
                        .clone()
                        .endOf("month")
                        .startOf("day")
                        .diff(startMoment, "days") + 1;
            }
            if (targetMonthMoment.isSame(endMoment, "month")) {
                useDays = endMoment.diff(targetMonthMoment, "days") + 1;
            }
            useMonths += useDays / daysInMonth;
            targetMonthMoment.add(1, "month");
        }
    }
    // 24ヶ月（2年）以上
    if (useMonths >= 24) {
        return now_enum_parser_1.TenancyTerm.MoreThanTwoYear;
    }
    // 12ヶ月（1年）以上
    if (useMonths >= 12) {
        return now_enum_parser_1.TenancyTerm.MoreThanOneYear;
    }
    // 7ヶ月以上
    if (useMonths >= 7) {
        return now_enum_parser_1.TenancyTerm.SevenMonthsToOneYear;
    }
    // 3ヶ月以上
    if (useMonths >= 3) {
        return now_enum_parser_1.TenancyTerm.ThreeToSevenMonths;
    }
    // 1ヶ月以上
    if (useMonths >= 1) {
        return now_enum_parser_1.TenancyTerm.OneToThreeMonths;
    }
    // 1ヶ月未満
    return now_enum_parser_1.TenancyTerm.LessThanOneMonth;
};
//# sourceMappingURL=convert_tenancy_period_to_tenancy_term.js.map