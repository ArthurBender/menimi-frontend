import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
type EndMode = "never" | "until" | "count";
type MonthlyMode = "monthday" | "weekday";
type YearlyMode = "monthday" | "weekday";

const weekdayOptions = [
  { code: "MO", labelKey: "weekday.mon" },
  { code: "TU", labelKey: "weekday.tue" },
  { code: "WE", labelKey: "weekday.wed" },
  { code: "TH", labelKey: "weekday.thu" },
  { code: "FR", labelKey: "weekday.fri" },
  { code: "SA", labelKey: "weekday.sat" },
  { code: "SU", labelKey: "weekday.sun" },
] as const;

const monthOptions = [
  { value: "1", labelKey: "month.jan" },
  { value: "2", labelKey: "month.feb" },
  { value: "3", labelKey: "month.mar" },
  { value: "4", labelKey: "month.apr" },
  { value: "5", labelKey: "month.may" },
  { value: "6", labelKey: "month.jun" },
  { value: "7", labelKey: "month.jul" },
  { value: "8", labelKey: "month.aug" },
  { value: "9", labelKey: "month.sep" },
  { value: "10", labelKey: "month.oct" },
  { value: "11", labelKey: "month.nov" },
  { value: "12", labelKey: "month.dec" },
] as const;

const monthDayOptions = Array.from({ length: 31 }, (_, index) => String(index + 1));

const weekPositionOptions = [
  { value: "1", labelKey: "ordinal.1" },
  { value: "2", labelKey: "ordinal.2" },
  { value: "3", labelKey: "ordinal.3" },
  { value: "4", labelKey: "ordinal.4" },
  { value: "5", labelKey: "ordinal.5" },
] as const;

function toUntilUtcDate(dateValue: string): string {
  const date = new Date(`${dateValue}T23:59:59`);
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function toggleArrayValue(values: string[], value: string): string[] {
  if (values.includes(value)) return values.filter((entry) => entry !== value);
  return [...values, value];
}

function sortNumericStrings(values: string[]): string[] {
  return [...values].sort((a, b) => Number(a) - Number(b));
}

interface SquareOption {
  value: string;
  label: string;
}

interface RRuleGeneratorProps {
  name?: string;
  initialRRule?: string | null;
}

function parseRRule(rrule: string) {
  const params: Record<string, string> = {};
  for (const part of rrule.split(";")) {
    const eqIndex = part.indexOf("=");
    if (eqIndex !== -1) params[part.slice(0, eqIndex)] = part.slice(eqIndex + 1);
  }

  const frequency = (["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].includes(params.FREQ ?? "")
    ? params.FREQ
    : "DAILY") as Frequency;
  const interval = params.INTERVAL || "1";

  const weekdays = params.BYDAY && !params.BYSETPOS ? params.BYDAY.split(",") : [];

  let monthlyMode: MonthlyMode = "monthday";
  let monthlyMonthDays = ["1"];
  let monthlyWeekdays: string[] = [];
  let monthlyWeekPositions = ["1"];
  if (frequency === "MONTHLY") {
    if (params.BYMONTHDAY) {
      monthlyMode = "monthday";
      monthlyMonthDays = params.BYMONTHDAY.split(",");
    } else if (params.BYDAY && params.BYSETPOS) {
      monthlyMode = "weekday";
      monthlyWeekdays = params.BYDAY.split(",");
      monthlyWeekPositions = params.BYSETPOS.split(",");
    }
  }

  let yearlyMode: YearlyMode = "monthday";
  const yearlyMonths = params.BYMONTH ? params.BYMONTH.split(",") : ["1"];
  let yearlyMonthDays = ["1"];
  let yearlyWeekdays: string[] = [];
  let yearlyWeekPositions = ["1"];
  if (frequency === "YEARLY") {
    if (params.BYMONTHDAY) {
      yearlyMode = "monthday";
      yearlyMonthDays = params.BYMONTHDAY.split(",");
    } else if (params.BYDAY && params.BYSETPOS) {
      yearlyMode = "weekday";
      yearlyWeekdays = params.BYDAY.split(",");
      yearlyWeekPositions = params.BYSETPOS.split(",");
    }
  }

  let endMode: EndMode = "never";
  let untilDate = "";
  let count = "10";
  if (params.UNTIL) {
    endMode = "until";
    untilDate = `${params.UNTIL.slice(0, 4)}-${params.UNTIL.slice(4, 6)}-${params.UNTIL.slice(6, 8)}`;
  } else if (params.COUNT) {
    endMode = "count";
    count = params.COUNT;
  }

  return {
    frequency, interval,
    weekdays,
    monthlyMode, monthlyMonthDays, monthlyWeekdays, monthlyWeekPositions,
    yearlyMode, yearlyMonths, yearlyMonthDays, yearlyWeekdays, yearlyWeekPositions,
    endMode, untilDate, count,
  };
}

const defaultRRuleState = parseRRule("");

const RRuleGenerator = ({ name = "rrule", initialRRule }: RRuleGeneratorProps) => {
  const { t } = useTranslation();
  const initial = initialRRule ? parseRRule(initialRRule) : defaultRRuleState;

  const [frequency, setFrequency] = useState<Frequency>(initial.frequency);
  const [interval, setInterval] = useState(initial.interval);

  const [weekdays, setWeekdays] = useState<string[]>(initial.weekdays);

  const [monthlyMode, setMonthlyMode] = useState<MonthlyMode>(initial.monthlyMode);
  const [monthlyMonthDays, setMonthlyMonthDays] = useState<string[]>(initial.monthlyMonthDays);
  const [monthlyWeekdays, setMonthlyWeekdays] = useState<string[]>(initial.monthlyWeekdays);
  const [monthlyWeekPositions, setMonthlyWeekPositions] = useState<string[]>(initial.monthlyWeekPositions);

  const [yearlyMode, setYearlyMode] = useState<YearlyMode>(initial.yearlyMode);
  const [yearlyMonths, setYearlyMonths] = useState<string[]>(initial.yearlyMonths);
  const [yearlyMonthDays, setYearlyMonthDays] = useState<string[]>(initial.yearlyMonthDays);
  const [yearlyWeekdays, setYearlyWeekdays] = useState<string[]>(initial.yearlyWeekdays);
  const [yearlyWeekPositions, setYearlyWeekPositions] = useState<string[]>(initial.yearlyWeekPositions);

  const [endMode, setEndMode] = useState<EndMode>(initial.endMode);
  const [untilDate, setUntilDate] = useState(initial.untilDate);
  const [count, setCount] = useState(initial.count);

  const rruleValue = useMemo(() => {
    const safeInterval = Math.max(1, Number(interval) || 1);
    const parts = [`FREQ=${frequency}`, `INTERVAL=${safeInterval}`];

    if (frequency === "WEEKLY" && weekdays.length > 0) {
      parts.push(`BYDAY=${weekdays.join(",")}`);
    }

    if (frequency === "MONTHLY") {
      if (monthlyMode === "monthday" && monthlyMonthDays.length > 0) {
        parts.push(`BYMONTHDAY=${sortNumericStrings(monthlyMonthDays).join(",")}`);
      }

      if (monthlyMode === "weekday") {
        if (monthlyWeekdays.length > 0) {
          parts.push(`BYDAY=${monthlyWeekdays.join(",")}`);
        }
        if (monthlyWeekPositions.length > 0) {
          parts.push(`BYSETPOS=${sortNumericStrings(monthlyWeekPositions).join(",")}`);
        }
      }
    }

    if (frequency === "YEARLY") {
      if (yearlyMonths.length > 0) {
        parts.push(`BYMONTH=${sortNumericStrings(yearlyMonths).join(",")}`);
      }

      if (yearlyMode === "monthday" && yearlyMonthDays.length > 0) {
        parts.push(`BYMONTHDAY=${sortNumericStrings(yearlyMonthDays).join(",")}`);
      }

      if (yearlyMode === "weekday") {
        if (yearlyWeekdays.length > 0) {
          parts.push(`BYDAY=${yearlyWeekdays.join(",")}`);
        }
        if (yearlyWeekPositions.length > 0) {
          parts.push(`BYSETPOS=${sortNumericStrings(yearlyWeekPositions).join(",")}`);
        }
      }
    }

    if (endMode === "until" && untilDate) {
      parts.push(`UNTIL=${toUntilUtcDate(untilDate)}`);
    }

    if (endMode === "count") {
      const safeCount = Math.max(1, Number(count) || 1);
      parts.push(`COUNT=${safeCount}`);
    }

    return parts.join(";");
  }, [
    count,
    endMode,
    frequency,
    interval,
    monthlyMode,
    monthlyMonthDays,
    monthlyWeekdays,
    monthlyWeekPositions,
    untilDate,
    weekdays,
    yearlyMode,
    yearlyMonthDays,
    yearlyMonths,
    yearlyWeekdays,
    yearlyWeekPositions,
  ]);

  const toggleWeekday = (dayCode: string) => {
    setWeekdays((previous) => toggleArrayValue(previous, dayCode));
  };

  const renderSquareCheckboxGroup = (
    idPrefix: string,
    options: SquareOption[],
    selectedValues: string[],
    onToggle: (value: string) => void,
  ) => (
    <div className="rrule-square-grid">
      {options.map((option) => (
        <div key={`${idPrefix}_${option.value}`}>
          <input
            id={`${idPrefix}_${option.value}`}
            type="checkbox"
            className="rrule-square-input"
            checked={selectedValues.includes(option.value)}
            onChange={() => onToggle(option.value)}
          />
          <label htmlFor={`${idPrefix}_${option.value}`} className="rrule-square-toggle">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <hr />
      <div className="grid grid-cols-2 gap-4">
        <div className="task-field-group">
          <label htmlFor="rrule_frequency">{t("rrule.frequency")}</label>
          <select
            id="rrule_frequency"
            value={frequency}
            onChange={(event) => setFrequency(event.target.value as Frequency)}
          >
            <option value="DAILY">{t("rrule.daily")}</option>
            <option value="WEEKLY">{t("rrule.weekly")}</option>
            <option value="MONTHLY">{t("rrule.monthly")}</option>
            <option value="YEARLY">{t("rrule.yearly")}</option>
          </select>
        </div>

        <div className="task-field-group">
          <label htmlFor="rrule_interval">{t("rrule.interval")}</label>
          <input
            id="rrule_interval"
            type="number"
            min={1}
            value={interval}
            onChange={(event) => setInterval(event.target.value)}
          />
        </div>
      </div>

      {frequency === "WEEKLY" && (
        <div className="task-field-group">
          <label>{t("rrule.repeatOn")}</label>
          {renderSquareCheckboxGroup(
            "weekday",
            weekdayOptions.map((weekday) => ({ value: weekday.code, label: t(weekday.labelKey) })),
            weekdays,
            toggleWeekday,
          )}
        </div>
      )}

      {frequency === "MONTHLY" && (
        <div className="flex flex-col gap-4">
          <div className="task-field-group">
            <label htmlFor="rrule_monthly_mode">{t("rrule.monthlyRuleType")}</label>
            <select
              id="rrule_monthly_mode"
              value={monthlyMode}
              onChange={(event) => setMonthlyMode(event.target.value as MonthlyMode)}
            >
              <option value="monthday">{t("rrule.byMonthDay")}</option>
              <option value="weekday">{t("rrule.byWeekdayPosition")}</option>
            </select>
          </div>

          {monthlyMode === "monthday" && (
            <div className="task-field-group">
              <label>{t("rrule.monthDays")}</label>
              {renderSquareCheckboxGroup(
                "monthly_day",
                monthDayOptions.map((day) => ({ value: day, label: day })),
                monthlyMonthDays,
                (day) => setMonthlyMonthDays((previous) => toggleArrayValue(previous, day)),
              )}
            </div>
          )}

          {monthlyMode === "weekday" && (
            <>
              <div className="task-field-group">
                <label>{t("rrule.weekPositions")}</label>
                {renderSquareCheckboxGroup(
                  "monthly_pos",
                  weekPositionOptions.map((position) => ({
                    value: position.value,
                    label: t(position.labelKey),
                  })),
                  monthlyWeekPositions,
                  (position) =>
                    setMonthlyWeekPositions((previous) => toggleArrayValue(previous, position)),
                )}
              </div>

              <div className="task-field-group">
                <label>{t("rrule.weekdays")}</label>
                {renderSquareCheckboxGroup(
                  "monthly_weekday",
                  weekdayOptions.map((weekday) => ({ value: weekday.code, label: t(weekday.labelKey) })),
                  monthlyWeekdays,
                  (day) => setMonthlyWeekdays((previous) => toggleArrayValue(previous, day)),
                )}
              </div>
            </>
          )}
        </div>
      )}

      {frequency === "YEARLY" && (
        <div className="flex flex-col gap-4">
          <div className="task-field-group">
            <label>{t("rrule.months")}</label>
            {renderSquareCheckboxGroup(
              "yearly_month",
              monthOptions.map((month) => ({ value: month.value, label: t(month.labelKey) })),
              yearlyMonths,
              (month) => setYearlyMonths((previous) => toggleArrayValue(previous, month)),
            )}
          </div>

          <div className="task-field-group">
            <label htmlFor="rrule_yearly_mode">{t("rrule.yearlyRuleType")}</label>
            <select
              id="rrule_yearly_mode"
              value={yearlyMode}
              onChange={(event) => setYearlyMode(event.target.value as YearlyMode)}
            >
              <option value="monthday">{t("rrule.byMonthDay")}</option>
              <option value="weekday">{t("rrule.byWeekdayPosition")}</option>
            </select>
          </div>

          {yearlyMode === "monthday" && (
            <div className="task-field-group">
              <label>{t("rrule.monthDays")}</label>
              {renderSquareCheckboxGroup(
                "yearly_day",
                monthDayOptions.map((day) => ({ value: day, label: day })),
                yearlyMonthDays,
                (day) => setYearlyMonthDays((previous) => toggleArrayValue(previous, day)),
              )}
            </div>
          )}

          {yearlyMode === "weekday" && (
            <>
              <div className="task-field-group">
                <label>{t("rrule.weekPositions")}</label>
                {renderSquareCheckboxGroup(
                  "yearly_pos",
                  weekPositionOptions.map((position) => ({
                    value: position.value,
                    label: t(position.labelKey),
                  })),
                  yearlyWeekPositions,
                  (position) =>
                    setYearlyWeekPositions((previous) => toggleArrayValue(previous, position)),
                )}
              </div>

              <div className="task-field-group">
                <label>{t("rrule.weekdays")}</label>
                {renderSquareCheckboxGroup(
                  "yearly_weekday",
                  weekdayOptions.map((weekday) => ({ value: weekday.code, label: t(weekday.labelKey) })),
                  yearlyWeekdays,
                  (day) => setYearlyWeekdays((previous) => toggleArrayValue(previous, day)),
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="task-field-group">
        <label htmlFor="rrule_end_mode">{t("rrule.ends")}</label>
        <select
          id="rrule_end_mode"
          value={endMode}
          onChange={(event) => setEndMode(event.target.value as EndMode)}
        >
          <option value="never">{t("rrule.never")}</option>
          <option value="until">{t("rrule.untilDate")}</option>
          <option value="count">{t("rrule.afterNOccurrences")}</option>
        </select>
      </div>

      {endMode === "until" && (
        <div className="task-field-group">
          <label htmlFor="rrule_until">{t("rrule.until")}</label>
          <input
            id="rrule_until"
            type="date"
            value={untilDate}
            onChange={(event) => setUntilDate(event.target.value)}
          />
        </div>
      )}

      {endMode === "count" && (
        <div className="task-field-group">
          <label htmlFor="rrule_count">{t("rrule.occurrences")}</label>
          <input
            id="rrule_count"
            type="number"
            min={1}
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </div>
      )}

      <input type="hidden" name={name} value={rruleValue} />
    </div>
  );
};

export default RRuleGenerator;
