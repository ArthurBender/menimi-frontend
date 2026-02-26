import { getTimeZones} from "@vvo/tzdb";

const timeZones = getTimeZones({ includeUtc: true });

export const timezoneOptions = timeZones.map((tz) => {
  return {
    value: tz.name,
    label: `${tz.name.replaceAll('_', ' ')} ${formatOffset(tz.rawOffsetInMinutes)}`,
  };
});

function formatOffset(offset: number) {
  const hours = Math.floor(offset / 60);
  const minutes = offset % 60;
  return `${offset > 0 ? "+" : ""}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}