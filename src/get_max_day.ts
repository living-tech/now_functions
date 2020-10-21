import { Moment } from "moment";
import { TenancyTerm } from "now-enum-parser";

import { getMaxTenancyMonthCount } from "./get_max_tenancy_month_count";

export const getMaxDay = (
  startMoment: Moment,
  tenancyTerm: TenancyTerm
): number | null => {
  const maxTenancyMonthCount = getMaxTenancyMonthCount(tenancyTerm);
  if (maxTenancyMonthCount === null) {
    return null;
  }

  if (startMoment.format("D") === "1") {
    const nextSartMoment = startMoment
      .clone()
      .add(maxTenancyMonthCount, "months")
      .startOf("month");
    return nextSartMoment.diff(startMoment, "day") - 1;
  }

  const startLastMoment = startMoment.clone().endOf("month").startOf("day");
  const startMaxDays = startMoment.daysInMonth();
  const startUseDays = startLastMoment.diff(startMoment, "days") + 1;

  let nextMinDay = 0;
  for (let i = 0; i <= maxTenancyMonthCount; i += 1) {
    const targetMonthMoment = startMoment
      .clone()
      .add(i, "month")
      .startOf("month");
    const targetMaDays = targetMonthMoment.daysInMonth();
    if (i === 0) {
      nextMinDay += startUseDays;
    } else if (i === maxTenancyMonthCount) {
      nextMinDay += Math.ceil((1 - startUseDays / startMaxDays) * targetMaDays);
    } else {
      nextMinDay += targetMaDays;
    }
  }
  return nextMinDay - 1;
};
