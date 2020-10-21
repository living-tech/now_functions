import moment from "moment";
import { TenancyTerm } from "now-enum-parser";

import { getMinDay } from "./get_min_day";
import { getMaxDay } from "./get_max_day";

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

  const endMoment = moment(tenancyPeriod.endAt).startOf("day");
  const useDays = endMoment.diff(startMoment, "day") + 1;
  const hasPlan = endAtDetails.some(
    (endAtDetail) =>
      endAtDetail.minDay <= useDays &&
      (endAtDetail.maxDay === null || useDays <= endAtDetail.maxDay)
  );

  return { hasPlan, endAtDetails: hasPlan === false ? endAtDetails : null };
};
