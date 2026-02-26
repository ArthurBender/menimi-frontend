import { useEffect, useState } from "react";
import moment from "moment";

import type { CalendarTask } from "../api/types";

interface OccurrenceModalProps {
  event: CalendarTask;
  description?: string;
  onClose: () => void;
  onSave: (status: "done" | "missed") => void;
}

const OccurrenceModal = ({ event, description, onClose, onSave }: OccurrenceModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<"done" | "missed">("done");

  useEffect(() => {
    setSelectedStatus(event.resource.status === "done" ? "done" : "missed");
  }, [event]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-light p-6 shadow-lg"
        onClick={(currentEvent) => currentEvent.stopPropagation()}
      >
        <h3 className="text-2xl font-bold">{event.title}</h3>
        <p className="mt-1 text-sm text-text/80">
          {moment(event.start).format("MMMM D, YYYY [at] HH:mm")}
        </p>

        {description && (
          <p className="mt-4 rounded-lg bg-surface/70 p-3 text-sm">{description}</p>
        )}

        <div className="mt-4 flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="occurrence-status">
            Status
          </label>
          <select
            id="occurrence-status"
            value={selectedStatus}
            onChange={(currentEvent) => setSelectedStatus(currentEvent.target.value as "done" | "missed")}
            className="rounded-xl border border-accent bg-light px-3 py-2 outline-none"
          >
            <option value="done">Done</option>
            <option value="missed">Missed</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="calendar-navigation !bg-gray-500 hover:!bg-gray-600" onClick={onClose}>
            Cancel
          </button>
          <button className="calendar-navigation" onClick={() => onSave(selectedStatus)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default OccurrenceModal;
