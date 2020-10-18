"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countShortOfDaysToNextPlan = void 0;
const moment_1 = __importDefault(require("moment"));
const now_enum_parser_1 = require("now-enum-parser");
const convert_tenancy_period_to_tenancy_term_1 = require("./convert_tenancy_period_to_tenancy_term");
const getNextTenancyTerm = (currentTenancyTerm) => {
    switch (currentTenancyTerm) {
        case now_enum_parser_1.TenancyTerm.LessThanOneMonth:
            return now_enum_parser_1.TenancyTerm.OneToThreeMonths;
        case now_enum_parser_1.TenancyTerm.OneToThreeMonths:
            return now_enum_parser_1.TenancyTerm.ThreeToSevenMonths;
        case now_enum_parser_1.TenancyTerm.ThreeToSevenMonths:
            return now_enum_parser_1.TenancyTerm.SevenMonthsToOneYear;
        case now_enum_parser_1.TenancyTerm.SevenMonthsToOneYear:
            return now_enum_parser_1.TenancyTerm.MoreThanOneYear;
        default:
            return null;
    }
};
exports.countShortOfDaysToNextPlan = (tenancyPeriod, roomPlans) => {
    const startMoment = moment_1.default(tenancyPeriod.startAt).startOf("day");
    const endMoment = moment_1.default(tenancyPeriod.endAt).startOf("day");
    if (!startMoment.isValid() ||
        !endMoment.isValid() ||
        startMoment.isAfter(endMoment)) {
        return null;
    }
    const currentTenancyTerm = convert_tenancy_period_to_tenancy_term_1.convertTenancyPeriodToTenancyTerm(tenancyPeriod);
    if (currentTenancyTerm === null) {
        return null;
    }
    const currentRoomPlan = roomPlans.find((roomPlan) => {
        return roomPlan.tenancyTerm === currentTenancyTerm;
    });
    if (currentRoomPlan === undefined) {
        return null;
    }
    const nextTenancyTerm = getNextTenancyTerm(currentTenancyTerm);
    const nextRoomPlan = roomPlans.find((roomPlan) => {
        return roomPlan.tenancyTerm === nextTenancyTerm;
    });
    if (nextRoomPlan === undefined) {
        return null;
    }
    const daysInMonth = startMoment.daysInMonth();
    const useDays = startMoment
        .clone()
        .endOf("month")
        .startOf("day")
        .diff(startMoment, "days") + 1;
    let addMonths = null;
    switch (currentTenancyTerm) {
        case now_enum_parser_1.TenancyTerm.LessThanOneMonth:
            addMonths = 1;
            break;
        case now_enum_parser_1.TenancyTerm.OneToThreeMonths:
            addMonths = 3;
            break;
        case now_enum_parser_1.TenancyTerm.ThreeToSevenMonths:
            addMonths = 7;
            break;
        case now_enum_parser_1.TenancyTerm.SevenMonthsToOneYear:
            addMonths = 12;
            break;
    }
    if (addMonths === null) {
        return null;
    }
    const nextPlanStartMonthMoment = startMoment
        .clone()
        .add(addMonths, "month")
        .startOf("month");
    const dateOfStartMonth = Math.ceil((1 - useDays / daysInMonth) * nextPlanStartMonthMoment.daysInMonth());
    const nextPlanStartMoment = nextPlanStartMonthMoment.add(dateOfStartMonth - 1, "days");
    const shortOfDays = nextPlanStartMoment.diff(endMoment, "days");
    const difference = Math.ceil(currentRoomPlan.totalRentCharge / 28) -
        Math.ceil(nextRoomPlan.totalRentCharge / 28);
    if (difference <= 0) {
        return null;
    }
    return { shortOfDays, difference };
};
//# sourceMappingURL=count_short_of_days_to_next_plan.js.map