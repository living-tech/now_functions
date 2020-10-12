"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countUseDays = void 0;
var moment_1 = __importDefault(require("moment"));
exports.countUseDays = function (tenancyPeriod) {
    var startMoment = moment_1.default(tenancyPeriod.startAt).startOf("day");
    var endMoment = moment_1.default(tenancyPeriod.endAt).startOf("day");
    if (!startMoment.isValid() ||
        !endMoment.isValid() ||
        startMoment.isAfter(endMoment)) {
        return null;
    }
    return endMoment.diff(startMoment, "days") + 1;
};
//# sourceMappingURL=count_use_days.js.map