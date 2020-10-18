import { TenancyTerm } from "now-enum-parser";
interface RoomPlan {
    tenancyTerm: TenancyTerm;
}
export declare const getMinDay: (startAt: string, roomPlans: RoomPlan[]) => number | null;
export {};
