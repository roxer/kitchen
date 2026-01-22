import "dayjs/plugin/timezone";
import type { ConfigType, OptionType, Dayjs, DayjsTimezone } from "dayjs";

export interface DayjsExtended {
  (date?: ConfigType, format?: OptionType, locale?: string, strict?: boolean): Dayjs;
  tz: DayjsTimezone;
}

declare global {
  interface Window {
    dayjs: DayjsExtended;
  }
  const dayjs: DayjsExtended;
}

