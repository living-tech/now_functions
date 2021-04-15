import moment from "moment";

import { convertTenancyPeriodToTenancyTerm } from "./convert_tenancy_period_to_tenancy_term";
import { Moment } from "moment";

import { TenancyTerm } from "now-enum-parser";

export const getMinTenancyMonthCount = (tenancyTerm: TenancyTerm): number => {
  switch (tenancyTerm) {
    case TenancyTerm.OneToThreeMonths:
      return 1;
    case TenancyTerm.ThreeToSevenMonths:
      return 3;
    case TenancyTerm.SevenMonthsToOneYear:
      return 7;
    case TenancyTerm.MoreThanOneYear:
      return 12;
    default:
      return 0;
  }
};

export const getMaxTenancyMonthCount = (
  tenancyTerm: TenancyTerm
): number | null => {
  switch (tenancyTerm) {
    case TenancyTerm.LessThanOneMonth:
      return 1;
    case TenancyTerm.OneToThreeMonths:
      return 3;
    case TenancyTerm.ThreeToSevenMonths:
      return 7;
    case TenancyTerm.SevenMonthsToOneYear:
      return 12;
    default:
      return null;
  }
};

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
  return nextMinDay - 2;
};

export const getMinDay = (
  startMoment: Moment,
  tenancyTerm: TenancyTerm
): number => {
  if (tenancyTerm === TenancyTerm.LessThanOneMonth) {
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

interface RoomPlan {
  tenancyTerm: TenancyTerm;
}

export const validateTenancyPeriod = (
  tenancyPeriod: {
    startAt: string;
    endAt: string;
  },
  roomPlans: RoomPlan[]
): {
  hasPlan: boolean;
  endAtDetails:
    | {
        tenancyTerm: TenancyTerm;
        minDay: number;
        maxDay: number | null;
        minDate: String;
        maxDate: String | null;
      }[]
    | null;
} => {
  const targetTenancyTerm = convertTenancyPeriodToTenancyTerm({
    startAt: tenancyPeriod.startAt,
    endAt: tenancyPeriod.endAt,
  });
  if (targetTenancyTerm === null) {
    return { hasPlan: false, endAtDetails: null };
  }

  const hasPlan = roomPlans.some((rp) => rp.tenancyTerm <= targetTenancyTerm);
  if (hasPlan === true) {
    return { hasPlan, endAtDetails: null };
  }

  const startMoment = moment(tenancyPeriod.startAt).startOf("day");
  const endAtDetails = roomPlans.map((roomPlan) => {
    const minDay = getMinDay(startMoment.clone(), roomPlan.tenancyTerm);
    const maxDay = getMaxDay(startMoment.clone(), roomPlan.tenancyTerm);
    return {
      tenancyTerm: roomPlan.tenancyTerm,
      minDay,
      maxDay,
      minDate: startMoment
        .clone()
        .add(minDay - 1, "days")
        .format("YYYY-MM-DD"),
      maxDate:
        maxDay !== null
          ? startMoment
              .clone()
              .add(maxDay - 1, "days")
              .format("YYYY-MM-DD")
          : null,
    };
  });
  return { hasPlan, endAtDetails: hasPlan === false ? endAtDetails : null };
};
