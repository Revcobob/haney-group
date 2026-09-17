"use client";

import { useEffect, useState } from "react";

const MS_PER_DAY = 86_400_000;
const SESSION_START_DAY = Math.floor(Date.UTC(2027, 0, 12) / MS_PER_DAY);
const SESSION_END_DAY = Math.floor(Date.UTC(2027, 4, 31) / MS_PER_DAY);

const TEXAS_DATE_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const SESSION_DATES = [
  {
    dateTime: "2026-11-03",
    month: "Nov",
    day: "03",
    year: "2026",
    title: "General election",
    detail: "Federal, state, and county officers are elected.",
    authority: "Texas Election Code § 41.001(a)(3)",
  },
  {
    dateTime: "2026-11-09",
    month: "Nov",
    day: "09",
    year: "2026",
    title: "Bill filing opens",
    detail:
      "Legislators and legislators-elect may begin filing bills for the 90th Legislature.",
    authority: "House Rule 8, § 7; Senate Rule 7.04(a)",
  },
  {
    dateTime: "2027-01-12T12:00:00-06:00",
    month: "Jan",
    day: "12",
    year: "2027",
    title: "The 90th Legislature convenes",
    detail: "The regular session begins at noon.",
    authority:
      "Texas Constitution art. III, § 5(a); Government Code § 301.001",
  },
  {
    dateTime: "2027-05-31",
    month: "May",
    day: "31",
    year: "2027",
    title: "Constitutional 140th day",
    detail: "A Texas regular session may not exceed 140 days.",
    authority: "Texas Constitution art. III, § 24(b)",
  },
] as const;

function texasDaySerial(date: Date) {
  const parts = TEXAS_DATE_PARTS.formatToParts(date);
  const values: Record<string, number> = {};

  for (const part of parts) {
    if (part.type === "year" || part.type === "month" || part.type === "day") {
      values[part.type] = Number(part.value);
    }
  }

  return Math.floor(
    Date.UTC(values.year, values.month - 1, values.day) / MS_PER_DAY
  );
}

function sessionPhase(today: number | null) {
  if (today === null) {
    return {
      value: "—",
      unit: "days",
      description: "until session begins",
    };
  }

  if (today < SESSION_START_DAY) {
    return {
      value: String(SESSION_START_DAY - today),
      unit: "days",
      description: "until session begins",
    };
  }

  if (today <= SESSION_END_DAY) {
    return {
      value: String(today - SESSION_START_DAY + 1),
      unit: "of 140",
      description: "current session day",
    };
  }

  return {
    value: "140",
    unit: "days",
    description: "regular session concluded",
  };
}

export function SessionCountdown() {
  const [today, setToday] = useState<number | null>(null);
  const phase = sessionPhase(today);

  useEffect(() => {
    const update = () => setToday(texasDaySerial(new Date()));
    update();
    const interval = window.setInterval(update, 60 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      className="session-clock"
      aria-label="90th Texas Legislature countdown"
    >
      <div className="container">
        <details className="session-rail">
          <summary className="session-rail__summary">
            <span className="session-rail__identity">90th Legislature</span>
            <span className="session-rail__count" aria-live="polite">
              <strong suppressHydrationWarning>{phase.value}</strong>
              <span>{phase.unit}</span>
            </span>
            <span className="session-rail__status">{phase.description}</span>
            <span className="session-rail__date">
              <time dateTime="2027-01-12T12:00:00-06:00">
                January 12, 2027 · Noon
              </time>
            </span>
            <span className="session-rail__action">
              <span>View key dates</span>
              <span className="session-rail__toggle" aria-hidden="true">
                +
              </span>
            </span>
          </summary>
          <div className="session-clock__date-panel">
            <ol className="session-clock__date-list">
              {SESSION_DATES.map((item) => (
                <li key={item.dateTime}>
                  <time dateTime={item.dateTime}>
                    <span>{item.month}</span>
                    <strong>{item.day}</strong>
                    <span>{item.year}</span>
                  </time>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                    <small>{item.authority}</small>
                  </div>
                </li>
              ))}
            </ol>
            <p className="session-clock__source">
              Dates through convening reflect the current Dates of Interest
              calendar. Additional chamber deadlines will be added when the
              official 90th Legislature calendars are issued.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
