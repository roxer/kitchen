import "dayjs/locale/en";

import dayjs from "dayjs";
import arraySupport from "dayjs/plugin/arraySupport";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isToday from "dayjs/plugin/isToday";
import timezone from "dayjs/plugin/timezone";
import toArray from "dayjs/plugin/toArray";
import utc from "dayjs/plugin/utc";

const ceil = (option, dayjsClass) => {
  dayjsClass.prototype.ceil = function (unit, amount) {
    const reminder = this.get(unit) % amount;

    if (reminder > 0) {
      return this.add(amount - reminder, unit).startOf(unit);
    } else {
      return this;
    }
  };
};
dayjs.extend(ceil);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(toArray);
dayjs.extend(arraySupport);
dayjs.extend(dayOfYear);
dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

dayjs.locale("en");
dayjs.tz.setDefault("GMT");

window.dayjs = dayjs;

export default dayjs;
