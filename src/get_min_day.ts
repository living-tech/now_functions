import moment from "moment";
import { TenancyTerm } from "now-enum-parser";

interface RoomPlan {
  tenancyTerm: TenancyTerm;
}

enum TenancyTermPlacedAt {
  "LessThanOneMonth" = 0,
  "OneToThreeMonths" = 1,
  "ThreeToSevenMonths" = 2,
  "SevenMonthsToOneYear" = 3,
  "MoreThanOneYear" = 4,
}

export const getMinDay = (
  startAt: string,
  roomPlans: RoomPlan[]
): number | null => {
  let minTenancyMonthCount: number | null = null;
  let minTenancyTermPlacedAt: TenancyTermPlacedAt | null = null;
  roomPlans.forEach((roomPlan) => {
    switch (roomPlan.tenancyTerm) {
      case TenancyTerm.LessThanOneMonth:
        minTenancyMonthCount = 0;
        minTenancyTermPlacedAt = TenancyTermPlacedAt.LessThanOneMonth;
        break;
      case TenancyTerm.OneToThreeMonths:
        if (
          minTenancyTermPlacedAt === null ||
          TenancyTermPlacedAt.OneToThreeMonths < minTenancyTermPlacedAt
        ) {
          minTenancyMonthCount = 1;
          minTenancyTermPlacedAt = TenancyTermPlacedAt.OneToThreeMonths;
        }
        break;
      case TenancyTerm.ThreeToSevenMonths:
        if (
          minTenancyTermPlacedAt === null ||
          TenancyTermPlacedAt.ThreeToSevenMonths < minTenancyTermPlacedAt
        ) {
          minTenancyMonthCount = 3;
          minTenancyTermPlacedAt = TenancyTermPlacedAt.OneToThreeMonths;
        }
        break;
      case TenancyTerm.SevenMonthsToOneYear:
        if (
          minTenancyTermPlacedAt === null ||
          TenancyTermPlacedAt.SevenMonthsToOneYear < minTenancyTermPlacedAt
        ) {
          minTenancyMonthCount = 7;
          minTenancyTermPlacedAt = TenancyTermPlacedAt.OneToThreeMonths;
        }
        break;
      case TenancyTerm.MoreThanOneYear:
        if (
          minTenancyTermPlacedAt === null ||
          TenancyTermPlacedAt.MoreThanOneYear < minTenancyTermPlacedAt
        ) {
          minTenancyMonthCount = 12;
          minTenancyTermPlacedAt = TenancyTermPlacedAt.OneToThreeMonths;
        }
        break;
    }
  });

  if (minTenancyMonthCount === null) {
    return null;
  }

  if (minTenancyMonthCount === 0) {
    return 6;
  }

  const startMoment = moment(startAt).startOf("day");
  if (!startMoment.isValid()) {
    return null;
  }

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
