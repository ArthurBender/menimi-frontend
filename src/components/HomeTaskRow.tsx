import { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import type { CalendarTask } from "../api/types";
import Modal from "./Modal";

interface HomeTaskRowProps {
  event: CalendarTask;
  isSaving: boolean;
  description?: string;
  dateLabel?: string;
  onComplete: () => void;
  onMiss: () => void;
}

const HomeTaskRow = ({
  event,
  isSaving,
  description,
  dateLabel,
  onComplete,
  onMiss,
}: HomeTaskRowProps) => {
  const { t, i18n } = useTranslation();
  const [showDetail, setShowDetail] = useState(false);

  const occurrenceDateLabel = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(event.start);

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-text py-2 last:border-b-0">
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => setShowDetail(true)}
        >
          <p className="truncate text-lg font-medium">{event.title}</p>
          {dateLabel && <p className="text-sm text-text/70 md:text-base">{dateLabel}</p>}
        </button>

        <div className="flex shrink-0 items-center gap-2">
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

      {showDetail && (
        <Modal
          title={event.title}
          onClose={() => setShowDetail(false)}
          footer={
            <button
              type="button"
              className="button bg-primary"
              onClick={() => setShowDetail(false)}
            >
              {t("common.cancel")}
            </button>
          }
        >
          <p className="mb-4 text-sm text-text/70">{occurrenceDateLabel}</p>
          {description ? (
            <p className="text-base">{description}</p>
          ) : (
            <p className="text-base text-text/50 italic">{t("task.noDescription")}</p>
          )}
        </Modal>
      )}
    </>
  );
};

export default HomeTaskRow;
