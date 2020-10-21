import { TenancyTerm } from "now-enum-parser";

export const getMinTenancyMonthCount = (tenancyTerm: TenancyTerm): number => {
  switch (tenancyTerm) {
    case TenancyTerm.OneToThreeMonths:
      return 1;
    case TenancyTerm.ThreeToSevenMonths:
      return 3;
    case TenancyTerm.SevenMonthsToOneYear:
      return 7;
    case TenancyTerm.MoreThanOneYear:
      return 12;
    default:
      return 0;
  }
};
