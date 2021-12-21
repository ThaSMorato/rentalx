import dayjs, { OpUnitType, QUnitType } from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

export class DayjsDateProvider implements IDateProvider {
  getDateFromNow(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  dateNow(): Date {
    return dayjs().toDate();
  }
  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  compare(
    start_date: Date,
    end_date: Date,
    by: QUnitType | OpUnitType = "hours"
  ): number {
    const end_date_formatted = this.convertToUTC(end_date);

    const start_date_formatted = this.convertToUTC(start_date);

    return dayjs(end_date_formatted).diff(start_date_formatted, by);
  }
}
