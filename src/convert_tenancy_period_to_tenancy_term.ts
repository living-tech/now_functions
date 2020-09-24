import moment from "moment";
import { TenancyTerm } from "now-enum-parser";

export const convertTenancyPeriodToTenancyTerm = (tenancyPeriod: {
  startAt: Date;
  endAt: Date;
}): TenancyTerm => {
  const startMoment = moment(tenancyPeriod.startAt);
  const endMoment = moment(tenancyPeriod.endAt);

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

  // 1年以上
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

  return TenancyTerm.LessThanOneMonth;
};
