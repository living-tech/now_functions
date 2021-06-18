import moment from "moment";
import { TenancyTerm } from "now-enum-parser";

import { countUseDays } from "./count_use_days";

/**
 * 入居日と退去日からプランを出す
 * 該当するプランがなければnullを返す
 */
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
    allUseDays < 8
  ) {
    return null;
  }

  let useMonths = 0;

  if (startMoment.isSame(endMoment, "month")) {
    const daysInMonth = startMoment.daysInMonth();
    const useDays = endMoment.diff(startMoment, "days") + 1;
    useMonths += useDays / daysInMonth;
  } else {
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
    return TenancyTerm.MoreThanTwoYear;
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
