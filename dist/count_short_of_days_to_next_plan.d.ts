import { TenancyTerm } from "now-enum-parser";
interface RoomPlan {
    totalRentCharge: number;
    tenancyTerm: TenancyTerm;
}
export declare const countShortOfDaysToNextPlan: (tenancyPeriod: {
    startAt: string;
    endAt: string;
}, roomPlans: RoomPlan[]) => {
    shortOfDays: number;
    difference: number;
} | null;
export {};
