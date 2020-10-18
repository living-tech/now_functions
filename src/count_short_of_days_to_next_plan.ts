import moment from "moment";
import { TenancyTerm } from "now-enum-parser";

import { convertTenancyPeriodToTenancyTerm } from "./convert_tenancy_period_to_tenancy_term";

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
    default:
      return null;
  }
};

interface RoomPlan {
  totalRentCharge: number;
  tenancyTerm: TenancyTerm;
}

export const countShortOfDaysToNextPlan = (
  tenancyPeriod: {
    startAt: string;
    endAt: string;
  },
  roomPlans: RoomPlan[]
): { shortOfDays: number; difference: number } | null => {
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

  const daysInMonth = startMoment.daysInMonth();
  const useDays =
    startMoment
      .clone()
      .endOf("month")
      .startOf("day")
      .diff(startMoment, "days") + 1;
  let addMonths: number | null = null;
  switch (currentTenancyTerm) {
    case TenancyTerm.LessThanOneMonth:
      addMonths = 1;
      break;
    case TenancyTerm.OneToThreeMonths:
      addMonths = 3;
      break;
    case TenancyTerm.ThreeToSevenMonths:
      addMonths = 7;
      break;
    case TenancyTerm.SevenMonthsToOneYear:
      addMonths = 12;
      break;
  }
  if (addMonths === null) {
    return null;
  }

  const nextPlanStartMonthMoment = startMoment
    .clone()
    .add(addMonths, "month")
    .startOf("month");
  const dateOfStartMonth = Math.ceil(
    (1 - useDays / daysInMonth) * nextPlanStartMonthMoment.daysInMonth()
  );
  const nextPlanStartMoment = nextPlanStartMonthMoment.add(
    dateOfStartMonth - 1,
    "days"
  );
  const shortOfDays = nextPlanStartMoment.diff(endMoment, "days");

  const difference =
    Math.ceil(currentRoomPlan.totalRentCharge / 28) -
    Math.ceil(nextRoomPlan.totalRentCharge / 28);
  if (difference <= 0) {
    return null;
  }

  return { shortOfDays, difference };
};
