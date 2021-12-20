import { OpUnitType, QUnitType } from "dayjs/esm";

export interface IDateProvider {
  compare(
    start_date: Date,
    end_date: Date,
    by?: QUnitType | OpUnitType
  ): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
}
