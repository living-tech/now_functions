import { Moment } from "moment";
import { TenancyTerm } from "now-enum-parser";

import { getMinTenancyMonthCount } from "./get_min_tenancy_month_count";

export const getMinDay = (
  startMoment: Moment,
  tenancyTerm: TenancyTerm
): number => {
  if (tenancyTerm === TenancyTerm.LessThanOneMonth) {
    return 7;
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
    } else if (i === minTenancyMonthCount) {
      minDayCount += Math.ceil(
        (1 - startUseDays / startMaxDays) * targetMaDays
      );
    } else {
      minDayCount += targetMaDays;
    }
  }
  return minDayCount;
};
