import moment from "moment";

export const countUseDays = (tenancyPeriod: {
  startAt: string;
  endAt: string;
}): number | null => {
  const startMoment = moment(tenancyPeriod.startAt).startOf("day");
  const endMoment = moment(tenancyPeriod.endAt).startOf("day");
  if (
    !startMoment.isValid() ||
    !endMoment.isValid() ||
    startMoment.isAfter(endMoment)
  ) {
    return null;
  }

  return endMoment.diff(startMoment, "days") + 1;
};
