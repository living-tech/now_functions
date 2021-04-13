import { Moment } from "moment";
import { TenancyTerm } from "now-enum-parser";
export declare const getMinTenancyMonthCount: (tenancyTerm: TenancyTerm) => number;
export declare const getMaxTenancyMonthCount: (tenancyTerm: TenancyTerm) => number | null;
export declare const getMaxDay: (startMoment: Moment, tenancyTerm: TenancyTerm) => number | null;
export declare const getMinDay: (startMoment: Moment, tenancyTerm: TenancyTerm) => number;
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
