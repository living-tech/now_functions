"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOverMinDay = void 0;
const moment_1 = __importDefault(require("moment"));
const get_min_day_1 = require("./get_min_day");
exports.validateOverMinDay = (tenancyPeriod, roomPlans) => {
    const startMoment = moment_1.default(tenancyPeriod.startAt).startOf("day");
    const endMoment = moment_1.default(tenancyPeriod.endAt).startOf("day");
    if (!startMoment.isValid() ||
        !endMoment.isValid() ||
        startMoment.isAfter(endMoment)) {
        return false;
    }
    const minDay = get_min_day_1.getMinDay(tenancyPeriod.startAt, roomPlans);
    return minDay !== null && endMoment.diff(startMoment, "days") + 1 >= minDay;
};
//# sourceMappingURL=validate_over_min_day.js.map