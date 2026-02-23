import { useMemo } from "react";
import type { CalendarTask } from "../api/types";

const dayKey = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

const dotClassByStatus: Partial<Record<"pending" | "done" | "missed", string>> = {
  pending: "bg-gray-400",
  done: "bg-green-500",
  missed: "bg-red-500",
};

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

    return (
      <div className="flex w-full flex-col items-center">
        <span className="block w-full text-center">{label}</span>
        {statuses.length > 0 && (
          <div className="mt-0.5 flex items-center justify-center gap-0.5">
            {statuses.slice(0, 5).map((status, index) => (
              <span
                key={`${status}-${index}`}
                className={`h-2 w-2 rounded-full ${dotClassByStatus[status]}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
};
