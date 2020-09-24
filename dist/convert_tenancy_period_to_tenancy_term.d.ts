import { TenancyTerm } from "now-enum-parser";
export declare const convertTenancyPeriodToTenancyTerm: (tenancyPeriod: {
    startAt: Date;
    endAt: Date;
}) => TenancyTerm;
