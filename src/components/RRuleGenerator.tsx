import { useMemo, useState } from "react";

type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
type EndMode = "never" | "until" | "count";
type MonthlyMode = "monthday" | "weekday";
type YearlyMode = "monthday" | "weekday";

const weekdayOptions = [
  { code: "MO", label: "Mon" },
  { code: "TU", label: "Tue" },
  { code: "WE", label: "Wed" },
  { code: "TH", label: "Thu" },
  { code: "FR", label: "Fri" },
  { code: "SA", label: "Sat" },
  { code: "SU", label: "Sun" },
];

const monthOptions = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

const monthDayOptions = Array.from({ length: 31 }, (_, index) => String(index + 1));

const weekPositionOptions = [
  { value: "1", label: "1st" },
  { value: "2", label: "2nd" },
  { value: "3", label: "3rd" },
  { value: "4", label: "4th" },
  { value: "5", label: "5th" },
];

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
}

const RRuleGenerator = ({ name = "rrule" }: RRuleGeneratorProps) => {
  const [frequency, setFrequency] = useState<Frequency>("DAILY");
  const [interval, setInterval] = useState("1");

  const [weekdays, setWeekdays] = useState<string[]>([]);

  const [monthlyMode, setMonthlyMode] = useState<MonthlyMode>("monthday");
  const [monthlyMonthDays, setMonthlyMonthDays] = useState<string[]>(["1"]);
  const [monthlyWeekdays, setMonthlyWeekdays] = useState<string[]>([]);
  const [monthlyWeekPositions, setMonthlyWeekPositions] = useState<string[]>(["1"]);

  const [yearlyMode, setYearlyMode] = useState<YearlyMode>("monthday");
  const [yearlyMonths, setYearlyMonths] = useState<string[]>(["1"]);
  const [yearlyMonthDays, setYearlyMonthDays] = useState<string[]>(["1"]);
  const [yearlyWeekdays, setYearlyWeekdays] = useState<string[]>([]);
  const [yearlyWeekPositions, setYearlyWeekPositions] = useState<string[]>(["1"]);

  const [endMode, setEndMode] = useState<EndMode>("never");
  const [untilDate, setUntilDate] = useState("");
  const [count, setCount] = useState("10");

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
          <label htmlFor="rrule_frequency">Frequency</label>
          <select
            id="rrule_frequency"
            value={frequency}
            onChange={(event) => setFrequency(event.target.value as Frequency)}
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>

        <div className="task-field-group">
          <label htmlFor="rrule_interval">Interval</label>
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
          <label>Repeat On</label>
          {renderSquareCheckboxGroup(
            "weekday",
            weekdayOptions.map((weekday) => ({ value: weekday.code, label: weekday.label })),
            weekdays,
            toggleWeekday,
          )}
        </div>
      )}

      {frequency === "MONTHLY" && (
        <div className="flex flex-col gap-4">
          <div className="task-field-group">
            <label htmlFor="rrule_monthly_mode">Monthly Rule Type</label>
            <select
              id="rrule_monthly_mode"
              value={monthlyMode}
              onChange={(event) => setMonthlyMode(event.target.value as MonthlyMode)}
            >
              <option value="monthday">By Month Day</option>
              <option value="weekday">By Weekday Position</option>
            </select>
          </div>

          {monthlyMode === "monthday" && (
            <div className="task-field-group">
              <label>Month Days</label>
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
                <label>Week Positions</label>
                {renderSquareCheckboxGroup(
                  "monthly_pos",
                  weekPositionOptions,
                  monthlyWeekPositions,
                  (position) =>
                    setMonthlyWeekPositions((previous) => toggleArrayValue(previous, position)),
                )}
              </div>

              <div className="task-field-group">
                <label>Weekdays</label>
                {renderSquareCheckboxGroup(
                  "monthly_weekday",
                  weekdayOptions.map((weekday) => ({ value: weekday.code, label: weekday.label })),
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
            <label>Months</label>
            {renderSquareCheckboxGroup(
              "yearly_month",
              monthOptions,
              yearlyMonths,
              (month) => setYearlyMonths((previous) => toggleArrayValue(previous, month)),
            )}
          </div>

          <div className="task-field-group">
            <label htmlFor="rrule_yearly_mode">Yearly Rule Type</label>
            <select
              id="rrule_yearly_mode"
              value={yearlyMode}
              onChange={(event) => setYearlyMode(event.target.value as YearlyMode)}
            >
              <option value="monthday">By Month Day</option>
              <option value="weekday">By Weekday Position</option>
            </select>
          </div>

          {yearlyMode === "monthday" && (
            <div className="task-field-group">
              <label>Month Days</label>
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
                <label>Week Positions</label>
                {renderSquareCheckboxGroup(
                  "yearly_pos",
                  weekPositionOptions,
                  yearlyWeekPositions,
                  (position) =>
                    setYearlyWeekPositions((previous) => toggleArrayValue(previous, position)),
                )}
              </div>

              <div className="task-field-group">
                <label>Weekdays</label>
                {renderSquareCheckboxGroup(
                  "yearly_weekday",
                  weekdayOptions.map((weekday) => ({ value: weekday.code, label: weekday.label })),
                  yearlyWeekdays,
                  (day) => setYearlyWeekdays((previous) => toggleArrayValue(previous, day)),
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="task-field-group">
        <label htmlFor="rrule_end_mode">Ends</label>
        <select
          id="rrule_end_mode"
          value={endMode}
          onChange={(event) => setEndMode(event.target.value as EndMode)}
        >
          <option value="never">Never</option>
          <option value="until">Until Date</option>
          <option value="count">After N Occurrences</option>
        </select>
      </div>

      {endMode === "until" && (
        <div className="task-field-group">
          <label htmlFor="rrule_until">Until</label>
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
          <label htmlFor="rrule_count">Occurrences</label>
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
