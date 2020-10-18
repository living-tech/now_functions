import { TenancyTerm } from "now-enum-parser";
interface RoomPlan {
    tenancyTerm: TenancyTerm;
}
export declare const validateOverMinDay: (tenancyPeriod: {
    startAt: string;
    endAt: string;
}, roomPlans: RoomPlan[]) => boolean;
export {};
