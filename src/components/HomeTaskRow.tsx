import { FiCheck, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import type { CalendarTask } from "../api/types";

interface HomeTaskRowProps {
  event: CalendarTask;
  isSaving: boolean;
  dateLabel?: string;
  onComplete: () => void;
  onMiss: () => void;
}

const HomeTaskRow = ({
  event,
  isSaving,
  dateLabel,
  onComplete,
  onMiss,
}: HomeTaskRowProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-4 border-b border-text py-2 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-medium">{event.title}</p>
      </div>

      {dateLabel && <p className="shrink-0 text-sm text-text/70 md:text-base">{dateLabel}</p>}

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-green-600 text-green-600 transition-colors hover:bg-green-600/10 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onComplete}
          disabled={isSaving}
          aria-label={t("home.completeOccurrence")}
          title={t("home.completeOccurrence")}
        >
          <FiCheck />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-red-600 text-red-600 transition-colors hover:bg-red-600/10 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onMiss}
          disabled={isSaving}
          aria-label={t("home.missOccurrence")}
          title={t("home.missOccurrence")}
        >
          <FiX />
        </button>
      </div>
    </div>
  )
}

export default HomeTaskRow;
