import moment from "moment";
import { TenancyTerm } from "now-enum-parser";

import { countUseDays } from "./count_use_days";

export const convertTenancyPeriodToTenancyTerm = (tenancyPeriod: {
  startAt: string;
  endAt: string;
}): TenancyTerm | null => {
  const startMoment = moment(tenancyPeriod.startAt).startOf("day");
  const endMoment = moment(tenancyPeriod.endAt).startOf("day");

  const allUseDays: number | null = countUseDays({
    startAt: tenancyPeriod.startAt,
    endAt: tenancyPeriod.endAt,
  });
  if (
    !startMoment.isValid() ||
    !endMoment.isValid() ||
    startMoment.isAfter(endMoment) ||
    allUseDays === null ||
    allUseDays < 7
  ) {
    return null;
  }

  let useMonths = 0;

  let targetMonthMoment = startMoment.clone().startOf("month");
  while (targetMonthMoment.isSameOrBefore(endMoment, "month")) {
    const daysInMonth = targetMonthMoment.daysInMonth();
    let useDays = daysInMonth;
    if (startMoment.isSame(endMoment, "month")) {
      useDays = endMoment.diff(targetMonthMoment, "days") + 1;
    } else if (targetMonthMoment.isSame(endMoment, "month")) {
      useDays = endMoment.diff(targetMonthMoment, "days") + 1;
    } else if (targetMonthMoment.isSame(startMoment, "month")) {
      useDays =
        targetMonthMoment.clone().add(1, "month").diff(startMoment, "days") + 1;
    }
    useMonths += useDays / daysInMonth;
    targetMonthMoment.add(1, "month");
  }

  // 12ヶ月（1年）以上
  if (useMonths >= 12) {
    return TenancyTerm.MoreThanOneYear;
  }

  // 7ヶ月以上
  if (useMonths >= 7) {
    return TenancyTerm.SevenMonthsToOneYear;
  }

  // 3ヶ月以上
  if (useMonths >= 3) {
    return TenancyTerm.ThreeToSevenMonths;
  }

  // 1ヶ月以上
  if (useMonths >= 1) {
    return TenancyTerm.OneToThreeMonths;
  }

  // 1ヶ月未満
  return TenancyTerm.LessThanOneMonth;
};
