import { useState } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar"
import { Link } from "react-router-dom";
import HomeTaskRow from "../components/HomeTaskRow";
import { useHomeCalendarEventRenderer } from "../components/HomeCalendarEventRenderer";
import { useTranslation } from "react-i18next";

import moment from "moment";

import { formatUserName } from "../api/auth";
import { useAuth } from "../api/useAuth";
import { localeFromLanguage } from "../i18n/config";
import { capitalize } from "../utils/formatting";
import { buildTaskEventsForMonth } from "../utils/occurrences";
import { saveCalendarTaskOccurrence } from "../utils/saveCalendarTaskOccurrence";
import { useTasks } from "../api/useTasks";

const Home = () => {
  const { user } = useAuth();
  const { tasks, isLoading, createOccurrence, updateOccurrence } = useTasks();
  const { t, i18n } = useTranslation();
  const [savingEventId, setSavingEventId] = useState<string | null>(null);
  const locale = localeFromLanguage(i18n.resolvedLanguage);
  const localizer = momentLocalizer(moment);
  const currentMonth = capitalize(
    new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }).format(new Date()),
  );
  const username = user ? formatUserName(user) || user.email : t("home.guestName");
  const timezone = user?.timezone ?? "Etc/UTC";

  const homeTasks = buildTaskEventsForMonth(tasks, new Date(), timezone);
  const DateHeader = useHomeCalendarEventRenderer(homeTasks);
  const pendingHomeTasks = homeTasks.filter((task) => task.resource.status === "pending");
  const today = moment();
  const todayTasks = pendingHomeTasks.filter((task) => moment(task.start).isSame(today, "day"));
  const weekTasks = pendingHomeTasks.filter((task) => {
    const taskDate = moment(task.start);
    return taskDate.isSame(today, "week") && taskDate.isAfter(today, "day");
  });

  const handleOccurrenceStatusUpdate = async (eventId: string, status: "done" | "missed") => {
    const event = homeTasks.find((calendarTask) => calendarTask.id === eventId);
    if (!event) return;

    setSavingEventId(eventId);

    try {
      await saveCalendarTaskOccurrence({
        calendarTask: event,
        taskId: event.resource.taskId,
        occurredAt: event.start,
        status,
        createOccurrence,
        updateOccurrence,
      });
    } finally {
      setSavingEventId(null);
    }
  };
  
  return (
    <div className="flex flex-col gap-10 justify-between h-full">
      <div className="flex gap-10 items-center justify-around">
        <h2 className="text-7xl font-semibold">{t("home.greeting", { name: username })}</h2>
        <Link
          to="/calendar"
          className="block h-70 w-120 cursor-pointer"
          aria-label={t("home.openCalendar")}
          title={t("home.openCalendar")}
        >
          <p className="text-center font-medium">{currentMonth}</p>
          <Calendar 
            localizer={localizer}
            views={["month"]}
            toolbar={false}
            events={[]}
            components={{ month: { dateHeader: DateHeader } }}
          />
        </Link>
      </div>

      <p className="text-xl bg-surface p-5 rounded-3xl">{t("home.resume")}</p>

      {isLoading && <p className="rounded-2xl bg-surface p-4 text-center">{t("home.loading")}</p>}

      <div className="flex gap-10">
        <div className="w-full">
          <h3 className="text-2xl font-semibold bg-accent w-full text-center p-2 rounded-3xl">{t("home.today")}</h3>

          <div className="flex flex-col">
            {todayTasks.map((task) => (
              <HomeTaskRow
                key={task.id}
                event={task}
                isSaving={savingEventId === task.id}
                onComplete={() => void handleOccurrenceStatusUpdate(task.id, "done")}
                onMiss={() => void handleOccurrenceStatusUpdate(task.id, "missed")}
              />
            ))}
            {!isLoading && todayTasks.length === 0 && <p className="py-2 text-center">{t("home.empty")}</p>}
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-2xl font-semibold bg-accent w-full text-center p-2 rounded-3xl">{t("home.thisWeek")}</h3>

          <div className="flex flex-col">
            {weekTasks.map((task) => (
              <HomeTaskRow
                key={task.id}
                event={task}
                isSaving={savingEventId === task.id}
                onComplete={() => void handleOccurrenceStatusUpdate(task.id, "done")}
                onMiss={() => void handleOccurrenceStatusUpdate(task.id, "missed")}
              />
            ))}
            {!isLoading && weekTasks.length === 0 && <p className="py-2 text-center">{t("home.empty")}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home
