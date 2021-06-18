"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countShortOfDaysToNextPlan = void 0;
const moment_1 = __importDefault(require("moment"));
const now_enum_parser_1 = require("now-enum-parser");
const convert_tenancy_period_to_tenancy_term_1 = require("./convert_tenancy_period_to_tenancy_term");
const count_use_days_1 = require("./count_use_days");
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
        case now_enum_parser_1.TenancyTerm.MoreThanOneYear:
            return now_enum_parser_1.TenancyTerm.MoreThanTwoYear;
        default:
            return null;
    }
};
const getMinTenancyMonthCount = (tenancyTerm) => {
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
const getMinDay = (startMoment, tenancyTerm) => {
    if (tenancyTerm === now_enum_parser_1.TenancyTerm.LessThanOneMonth) {
        return 8;
    }
    const minTenancyMonthCount = getMinTenancyMonthCount(tenancyTerm);
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
    const useDays = count_use_days_1.countUseDays({
        startAt: tenancyPeriod.startAt,
        endAt: tenancyPeriod.endAt,
    });
    if (useDays === null) {
        return null;
    }
    const shortOfDays = getMinDay(startMoment, nextRoomPlan.tenancyTerm) - useDays;
    const difference = Math.ceil(currentRoomPlan.totalRentCharge / 28) -
        Math.ceil(nextRoomPlan.totalRentCharge / 28);
    if (difference <= 0) {
        return null;
    }
    return { shortOfDays, difference };
};
//# sourceMappingURL=count_short_of_days_to_next_plan.js.map