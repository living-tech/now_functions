import { TenancyTerm } from "now-enum-parser";

export const getMaxTenancyMonthCount = (
  tenancyTerm: TenancyTerm
): number | null => {
  switch (tenancyTerm) {
    case TenancyTerm.LessThanOneMonth:
      return 1;
    case TenancyTerm.OneToThreeMonths:
      return 3;
    case TenancyTerm.ThreeToSevenMonths:
      return 7;
    case TenancyTerm.SevenMonthsToOneYear:
      return 12;
    default:
      return null;
  }
};
