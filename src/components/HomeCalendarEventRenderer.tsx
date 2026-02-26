import { useMemo } from "react";
import type { CalendarTask } from "../api/types";
import { getOccurrenceStatusColor } from "../utils/calendarEventColors";

const dayKey = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

export const useHomeCalendarEventRenderer = (events: CalendarTask[]) => {
  const statusesByDay = useMemo(() => {
    const map = new Map<number, CalendarTask["resource"]["status"][]>();

    for (const event of events) {
      const key = dayKey(event.start);
      const statuses = map.get(key) ?? [];
      statuses.push(event.resource.status);
      map.set(key, statuses);
    }

    return map;
  }, [events]);

  return ({ label, date }: { label: string; date: Date }) => {
    const statuses = statusesByDay.get(dayKey(date)) ?? [];
    const overflowingStatuses = statuses.length - 5;

    return (
      <div className="flex w-full flex-col items-center">
        <span className="block w-full text-center">{label}</span>
        {statuses.length > 0 && (
          <div className="mt-0.5 flex items-center justify-center gap-0.5">
            {statuses.slice(0, overflowingStatuses > 0 ? 3 : 4).map((status, index) => (
              <span
                key={`${status}-${index}`}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: getOccurrenceStatusColor(status) }}
              />
            ))}
            {overflowingStatuses > 0 && <span className="text-[8px] leading-none">+{overflowingStatuses}</span>}
          </div>
        )}
      </div>
    );
  };
};
