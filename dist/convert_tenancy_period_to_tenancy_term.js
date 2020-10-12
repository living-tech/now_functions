"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTenancyPeriodToTenancyTerm = void 0;
var moment_1 = __importDefault(require("moment"));
var now_enum_parser_1 = require("now-enum-parser");
var count_use_days_1 = require("./count_use_days");
exports.convertTenancyPeriodToTenancyTerm = function (tenancyPeriod) {
    var startMoment = moment_1.default(tenancyPeriod.startAt).startOf("day");
    var endMoment = moment_1.default(tenancyPeriod.endAt).startOf("day");
    var allUseDays = count_use_days_1.countUseDays({
        startAt: tenancyPeriod.startAt,
        endAt: tenancyPeriod.endAt,
    });
    if (!startMoment.isValid() ||
        !endMoment.isValid() ||
        startMoment.isAfter(endMoment) ||
        allUseDays === null ||
        allUseDays < 7) {
        return null;
    }
    var useMonths = 0;
    var targetMonthMoment = startMoment.clone().startOf("month");
    while (targetMonthMoment.isSameOrBefore(endMoment, "month")) {
        var daysInMonth = targetMonthMoment.daysInMonth();
        var useDays = daysInMonth;
        if (startMoment.isSame(endMoment, "month")) {
            useDays = endMoment.diff(targetMonthMoment, "days") + 1;
        }
        else if (targetMonthMoment.isSame(endMoment, "month")) {
            useDays = endMoment.diff(targetMonthMoment, "days") + 1;
        }
        else if (targetMonthMoment.isSame(startMoment, "month")) {
            useDays =
                targetMonthMoment.clone().add(1, "month").diff(startMoment, "days") + 1;
        }
        useMonths += useDays / daysInMonth;
        targetMonthMoment.add(1, "month");
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