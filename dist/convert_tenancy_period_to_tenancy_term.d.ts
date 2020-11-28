import { TenancyTerm } from "now-enum-parser";
/**
 * 入居日と退去日からプランを出す
 * 該当するプランがなければnullを返す
 */
export declare const convertTenancyPeriodToTenancyTerm: (tenancyPeriod: {
    startAt: string;
    endAt: string;
}) => TenancyTerm | null;
