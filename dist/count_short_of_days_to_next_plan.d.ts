import { RoomPlan, TenancyPeriod, CountShortOfDaysToNextPlan } from "./interface";
export declare const countShortOfDaysToNextPlan: (tenancyPeriod: TenancyPeriod, roomPlans: RoomPlan[]) => CountShortOfDaysToNextPlan | null;
