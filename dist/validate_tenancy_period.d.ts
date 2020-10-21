import { TenancyTerm } from "now-enum-parser";
interface RoomPlan {
    tenancyTerm: TenancyTerm;
}
export declare const validateTenancyPeriod: (tenancyPeriod: {
    startAt: string;
    endAt: string;
}, roomPlans: RoomPlan[]) => {
    hasPlan: boolean;
    endAtDetails: {
        tenancyTerm: TenancyTerm;
        minDay: number;
        maxDay: number | null;
        minDate: String;
        maxDate: String | null;
    }[] | null;
};
export {};
