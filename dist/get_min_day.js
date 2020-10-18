"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinDay = void 0;
const moment_1 = __importDefault(require("moment"));
const now_enum_parser_1 = require("now-enum-parser");
var TenancyTermPlacedAt;
(function (TenancyTermPlacedAt) {
    TenancyTermPlacedAt[TenancyTermPlacedAt["LessThanOneMonth"] = 0] = "LessThanOneMonth";
    TenancyTermPlacedAt[TenancyTermPlacedAt["OneToThreeMonths"] = 1] = "OneToThreeMonths";
    TenancyTermPlacedAt[TenancyTermPlacedAt["ThreeToSevenMonths"] = 2] = "ThreeToSevenMonths";
    TenancyTermPlacedAt[TenancyTermPlacedAt["SevenMonthsToOneYear"] = 3] = "SevenMonthsToOneYear";
    TenancyTermPlacedAt[TenancyTermPlacedAt["MoreThanOneYear"] = 4] = "MoreThanOneYear";
})(TenancyTermPlacedAt || (TenancyTermPlacedAt = {}));
exports.getMinDay = (startAt, roomPlans) => {
    let minTenancyMonthCount = null;
    let minTenancyTermPlacedAt = null;
    roomPlans.forEach((roomPlan) => {
        switch (roomPlan.tenancyTerm) {
            case now_enum_parser_1.TenancyTerm.LessThanOneMonth:
                minTenancyMonthCount = 0;
                minTenancyTermPlacedAt = TenancyTermPlacedAt.LessThanOneMonth;
                break;
            case now_enum_parser_1.TenancyTerm.OneToThreeMonths:
                if (minTenancyTermPlacedAt === null ||
                    TenancyTermPlacedAt.OneToThreeMonths < minTenancyTermPlacedAt) {
                    minTenancyMonthCount = 1;
                    minTenancyTermPlacedAt = TenancyTermPlacedAt.OneToThreeMonths;
                }
                break;
            case now_enum_parser_1.TenancyTerm.ThreeToSevenMonths:
                if (minTenancyTermPlacedAt === null ||
                    TenancyTermPlacedAt.ThreeToSevenMonths < minTenancyTermPlacedAt) {
                    minTenancyMonthCount = 3;
                    minTenancyTermPlacedAt = TenancyTermPlacedAt.OneToThreeMonths;
                }
                break;
            case now_enum_parser_1.TenancyTerm.SevenMonthsToOneYear:
                if (minTenancyTermPlacedAt === null ||
                    TenancyTermPlacedAt.SevenMonthsToOneYear < minTenancyTermPlacedAt) {
                    minTenancyMonthCount = 7;
                    minTenancyTermPlacedAt = TenancyTermPlacedAt.OneToThreeMonths;
                }
                break;
            case now_enum_parser_1.TenancyTerm.MoreThanOneYear:
                if (minTenancyTermPlacedAt === null ||
                    TenancyTermPlacedAt.MoreThanOneYear < minTenancyTermPlacedAt) {
                    minTenancyMonthCount = 12;
                    minTenancyTermPlacedAt = TenancyTermPlacedAt.OneToThreeMonths;
                }
                break;
        }
    });
    if (minTenancyMonthCount === null) {
        return null;
    }
    if (minTenancyMonthCount === 0) {
        return 6;
    }
    const startMoment = moment_1.default(startAt).startOf("day");
    if (!startMoment.isValid()) {
        return null;
    }
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