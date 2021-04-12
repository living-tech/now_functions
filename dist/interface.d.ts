import { TenancyTerm } from "now-enum-parser";
export interface TenancyPeriod {
    startAt: string;
    endAt: string;
}
export interface RoomPlan {
    totalRentCharge: number;
    tenancyTerm: TenancyTerm;
}
export interface CountShortOfDaysToNextPlan {
    shortOfDays: number;
    difference: number;
}
