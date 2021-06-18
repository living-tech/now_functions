import moment, { Moment } from "moment";
import { TenancyTerm } from "now-enum-parser";

import {
  RoomPlan,
  TenancyPeriod,
  CountShortOfDaysToNextPlan,
} from "./interface";
import { convertTenancyPeriodToTenancyTerm } from "./convert_tenancy_period_to_tenancy_term";
import { countUseDays } from "./count_use_days";

const getNextTenancyTerm = (
  currentTenancyTerm: TenancyTerm | null
): TenancyTerm | null => {
  switch (currentTenancyTerm) {
    case TenancyTerm.LessThanOneMonth:
      return TenancyTerm.OneToThreeMonths;
    case TenancyTerm.OneToThreeMonths:
      return TenancyTerm.ThreeToSevenMonths;
    case TenancyTerm.ThreeToSevenMonths:
      return TenancyTerm.SevenMonthsToOneYear;
    case TenancyTerm.SevenMonthsToOneYear:
      return TenancyTerm.MoreThanOneYear;
    case TenancyTerm.MoreThanOneYear:
      return TenancyTerm.MoreThanTwoYear;
    default:
      return null;
  }
};

const getMinTenancyMonthCount = (tenancyTerm: TenancyTerm): number => {
  switch (tenancyTerm) {
    case TenancyTerm.OneToThreeMonths:
      return 1;
    case TenancyTerm.ThreeToSevenMonths:
      return 3;
    case TenancyTerm.SevenMonthsToOneYear:
      return 7;
    case TenancyTerm.MoreThanOneYear:
      return 12;
    case TenancyTerm.MoreThanTwoYear:
      return 24;
    default:
      return 0;
  }
};

const getMinDay = (startMoment: Moment, tenancyTerm: TenancyTerm): number => {
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

export const countShortOfDaysToNextPlan = (
  tenancyPeriod: TenancyPeriod,
  roomPlans: RoomPlan[]
): CountShortOfDaysToNextPlan | null => {
  const startMoment = moment(tenancyPeriod.startAt).startOf("day");
  const endMoment = moment(tenancyPeriod.endAt).startOf("day");
  if (
    !startMoment.isValid() ||
    !endMoment.isValid() ||
    startMoment.isAfter(endMoment)
  ) {
    return null;
  }

  const currentTenancyTerm = convertTenancyPeriodToTenancyTerm(tenancyPeriod);
  if (currentTenancyTerm === null) {
    return null;
  }

  const currentRoomPlan = roomPlans.find((roomPlan) => {
    return roomPlan.tenancyTerm === currentTenancyTerm;
  });
  if (currentRoomPlan === undefined) {
    return null;
  }

  const nextTenancyTerm = getNextTenancyTerm(currentTenancyTerm);
  const nextRoomPlan = roomPlans.find((roomPlan) => {
    return roomPlan.tenancyTerm === nextTenancyTerm;
  });
  if (nextRoomPlan === undefined) {
    return null;
  }

  const useDays: number | null = countUseDays({
    startAt: tenancyPeriod.startAt,
    endAt: tenancyPeriod.endAt,
  });
  if (useDays === null) {
    return null;
  }
  const shortOfDays =
    getMinDay(startMoment, nextRoomPlan.tenancyTerm) - useDays;

  const difference =
    Math.ceil(currentRoomPlan.totalRentCharge / 28) -
    Math.ceil(nextRoomPlan.totalRentCharge / 28);
  if (difference <= 0) {
    return null;
  }

  return { shortOfDays, difference };
};
