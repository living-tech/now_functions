"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTenancyPeriod = void 0;
const moment_1 = __importDefault(require("moment"));
const get_min_day_1 = require("./get_min_day");
const get_max_day_1 = require("./get_max_day");
exports.validateTenancyPeriod = (tenancyPeriod, roomPlans) => {
    const startMoment = moment_1.default(tenancyPeriod.startAt).startOf("day");
    const endAtDetails = roomPlans.map((roomPlan) => {
        const minDay = get_min_day_1.getMinDay(startMoment.clone(), roomPlan.tenancyTerm);
        const maxDay = get_max_day_1.getMaxDay(startMoment.clone(), roomPlan.tenancyTerm);
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
    const endMoment = moment_1.default(tenancyPeriod.endAt).startOf("day");
    const useDays = endMoment.diff(startMoment, "day") + 1;
    const hasPlan = endAtDetails.some((endAtDetail) => endAtDetail.minDay <= useDays &&
        (endAtDetail.maxDay === null || useDays <= endAtDetail.maxDay));
    return { hasPlan, endAtDetails: hasPlan === false ? endAtDetails : null };
};
//# sourceMappingURL=validate_tenancy_period.js.map