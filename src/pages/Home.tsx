import { useEffect, useState } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar"
import { Link } from "react-router-dom";
import HomeTaskRow from "../components/HomeTaskRow";
import { useHomeCalendarEventRenderer } from "../components/HomeCalendarEventRenderer";
import Panel from "../components/Panel";
import { useTranslation } from "react-i18next";

import moment from "moment";

import { formatUserName } from "../api/auth";
import { useAuth } from "../api/useAuth";
import { getWelcomeMessage } from "../api/welcomeMessage";
import { getTaskOccurrenceStats, type TaskOccurrenceStats } from "../api/tasks";
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
  const [welcomeMessage, setWelcomeMessage] = useState(t("home.resume"));
  const [isLoadingWelcomeMessage, setIsLoadingWelcomeMessage] = useState(true);
  const [stats, setStats] = useState<TaskOccurrenceStats>({ done: 0, missed: 0 });
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
  const weekTaskDateFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const homeTasks = buildTaskEventsForMonth(tasks, new Date(), timezone);
  const DateHeader = useHomeCalendarEventRenderer(homeTasks);
  const pendingHomeTasks = homeTasks.filter((task) => task.resource.status === "pending");
  const today = moment();
  const todayTasks = pendingHomeTasks.filter((task) => moment(task.start).isSame(today, "day"));
  const weekTasks = pendingHomeTasks.filter((task) => {
    const taskDate = moment(task.start);
    return taskDate.isSame(today, "week") && taskDate.isAfter(today, "day");
  });

  useEffect(() => {
    let isActive = true;

    const loadStats = async () => {
      try {
        const data = await getTaskOccurrenceStats();
        if (isActive) setStats(data);
      } catch {
        // keep zeros on error
      }
    };

    void loadStats();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    setWelcomeMessage(t("home.resume"));
    setIsLoadingWelcomeMessage(true);

    const loadWelcomeMessage = async () => {
      try {
        const response = await getWelcomeMessage(i18n.resolvedLanguage);
        if (!isActive) return;
        setWelcomeMessage(response.message || t("home.resume"));
      } catch {
        if (!isActive) return;
        setWelcomeMessage(t("home.resume"));
      } finally {
        if (isActive) {
          setIsLoadingWelcomeMessage(false);
        }
      }
    };

    void loadWelcomeMessage();

    return () => {
      isActive = false;
    };
  }, [t]);

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-6 justify-center h-full">
          <h2 className="text-3xl font-bold leading-tight lg:text-5xl xl:text-7xl text-center">
            {t("home.greeting", { name: username })}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-text">{t("home.yourStats")}:</span>
            <span className="rounded-full bg-done text-background px-3 py-1 text-sm font-semibold">
              {stats.done} {t("home.tasksDone")}
            </span>
            <span className="rounded-full bg-missed px-3 py-1 text-sm font-semibold text-background">
              {stats.missed} {t("home.tasksMissed")}
            </span>
          </div>
        </div>

        <Link
          to="/calendar"
          className="block cursor-pointer lg:w-fit"
          aria-label={t("home.openCalendar")}
          title={t("home.openCalendar")}
        >
          <p className="text-center w-full font-medium">{currentMonth}</p>
          <div className="h-60 xl:h-65 w-[calc(100vw-6rem)] md:w-100 xl:w-120 mx-auto lg:mx-0">
            <Calendar
              localizer={localizer}
              views={["month"]}
              toolbar={false}
              events={[]}
              components={{ month: { dateHeader: DateHeader } }}
            />
          </div>
        </Link>
      </div>

      <div className="rounded-3xl bg-surface p-4 md:p-5">
        {isLoadingWelcomeMessage ? (
          <div className="flex flex-col gap-2" aria-live="polite" aria-busy="true">
            <div className="h-5 w-11/12 animate-pulse rounded-full bg-dark/10 md:h-6" />
            <div className="h-5 w-8/12 animate-pulse rounded-full bg-dark/10 md:h-6" />
          </div>
        ) : (
          <p className="text-base md:text-xl">{welcomeMessage}</p>
        )}
      </div>

      {isLoading && <p className="rounded-2xl bg-surface p-4 text-center">{t("home.loading")}</p>}

      <div className="flex flex-col gap-4 md:flex-row">
        <Panel title={`${t("home.today")}: ${todayTasks.length}`}>
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
            {!isLoading && todayTasks.length === 0 && (
              <p className="py-2 text-center">{t("home.empty")}</p>
            )}
          </div>
        </Panel>

        <Panel title={`${t("home.thisWeek")}: ${weekTasks.length}`}>
          <div className="flex flex-col">
            {weekTasks.map((task) => (
              <HomeTaskRow
                key={task.id}
                event={task}
                isSaving={savingEventId === task.id}
                dateLabel={weekTaskDateFormatter.format(task.start)}
                onComplete={() => void handleOccurrenceStatusUpdate(task.id, "done")}
                onMiss={() => void handleOccurrenceStatusUpdate(task.id, "missed")}
              />
            ))}
            {!isLoading && weekTasks.length === 0 && (
              <p className="py-2 text-center">{t("home.empty")}</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default Home
