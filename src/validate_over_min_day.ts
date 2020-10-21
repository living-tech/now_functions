// import moment from "moment";
// import { TenancyTerm } from "now-enum-parser";

// import { getMinDay } from "./get_min_day";

// interface RoomPlan {
//   tenancyTerm: TenancyTerm;
// }

// export const validateOverMinDay = (
//   tenancyPeriod: {
//     startAt: string;
//     endAt: string;
//   },
//   roomPlans: RoomPlan[]
// ): boolean => {
//   const startMoment = moment(tenancyPeriod.startAt).startOf("day");
//   const endMoment = moment(tenancyPeriod.endAt).startOf("day");
//   if (
//     !startMoment.isValid() ||
//     !endMoment.isValid() ||
//     startMoment.isAfter(endMoment)
//   ) {
//     return false;
//   }

//   const minDay = getMinDay(tenancyPeriod.startAt, roomPlans);
//   return minDay !== null && endMoment.diff(startMoment, "days") + 1 >= minDay;
// };
