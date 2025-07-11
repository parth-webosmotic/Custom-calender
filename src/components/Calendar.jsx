import React from "react";
import PropTypes from "prop-types";

export default function Calendar({
  year,
  month,
  firstDay,
  daysInMonth,
  startDate,
  endDate,
  isSameDate,
  isInRange,
  isDisabledDate,
  handleDateClick,
  handleMonthChange,
  setView,
  VIEW,
  currentDate,
}) {
  const days = Array(firstDay)
    .fill(null)
    .concat([...Array(daysInMonth)].map((_, i) => i + 1));
  return (
    <div className="calendar">
      <div className="header">
        <div
          className="nav-btn"
          role="button"
          tabIndex={0}
          aria-label="Previous month"
          onClick={() => handleMonthChange(-1)}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleMonthChange(-1)
          }
        >
          ❮
        </div>
        <span
          className="month-name"
          role="button"
          tabIndex={0}
          onClick={() => setView(VIEW.MONTH)}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && setView(VIEW.MONTH)
          }
          aria-label="Select month"
        >
          {currentDate.toLocaleString("default", { month: "long" })}
        </span>
        <span
          className="year-name"
          role="button"
          tabIndex={0}
          onClick={() => setView(VIEW.YEAR)}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && setView(VIEW.YEAR)
          }
          aria-label="Select year"
        >
          {year}
        </span>
        <div
          className="nav-btn"
          role="button"
          tabIndex={0}
          aria-label="Next month"
          onClick={() => handleMonthChange(1)}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleMonthChange(1)
          }
        >
          ❯
        </div>
      </div>
      <div className="weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={`${d}-${i}`}>{d}</div>
        ))}
      </div>
      <div className="days">
        {days.map((day, idx) => {
          const isDisabled = day && isDisabledDate(year, month, day);
          const className = `
            day 
            ${day && isSameDate(startDate, year, month, day) ? "start" : ""}
            ${day && isSameDate(endDate, year, month, day) ? "end" : ""}
            ${day && isInRange(year, month, day) ? "in-range" : ""}
            ${isDisabled ? "disabled" : ""}
          `;
          return (
            <div
              key={idx}
              className={className}
              onClick={() => !isDisabled && day && handleDateClick(day)}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Calendar.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  firstDay: PropTypes.number.isRequired,
  daysInMonth: PropTypes.number.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  isSameDate: PropTypes.func.isRequired,
  isInRange: PropTypes.func.isRequired,
  isDisabledDate: PropTypes.func.isRequired,
  handleDateClick: PropTypes.func.isRequired,
  handleMonthChange: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  VIEW: PropTypes.object.isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
};
