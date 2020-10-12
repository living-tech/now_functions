import { TenancyTerm } from "now-enum-parser";
export declare const convertTenancyPeriodToTenancyTerm: (tenancyPeriod: {
    startAt: string;
    endAt: string;
}) => TenancyTerm | null;
