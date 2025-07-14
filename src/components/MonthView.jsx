import React from "react";
import PropTypes from "prop-types";

export default function MonthView({
  year,
  currentDate,
  setCurrentDate,
  handleMonthSelect,
  isDisabledMonth,
  onYearClick,
}) {
  return (
    <div className="month-view">
      <div className="header">
        <div
          className="nav-btn"
          role="button"
          tabIndex={0}
          aria-label="Previous year"
          onClick={() =>
            setCurrentDate(new Date(currentDate.setFullYear(year - 1)))
          }
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            setCurrentDate(new Date(currentDate.setFullYear(year - 1)))
          }
        >
          ❮
        </div>
        {onYearClick ? (
          <button
            type="button"
            className="year-btn"
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em', textDecoration: 'none', outline: 'none' }}
            onClick={onYearClick}
          >
            {year}
          </button>
        ) : (
          <div>{year}</div>
        )}
        <div
          className="nav-btn"
          role="button"
          tabIndex={0}
          aria-label="Next year"
          onClick={() =>
            setCurrentDate(new Date(currentDate.setFullYear(year + 1)))
          }
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            setCurrentDate(new Date(currentDate.setFullYear(year + 1)))
          }
        >
          ❯
        </div>
      </div>
      <div className="month-grid">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={`month${
              isDisabledMonth(year, i) ? " disabled" : ""
            }${
              currentDate.getFullYear() === year && currentDate.getMonth() === i
                ? " selected"
                : ""
            }`}
            role="button"
            tabIndex={isDisabledMonth(year, i) ? -1 : 0}
            aria-disabled={isDisabledMonth(year, i)}
            onClick={() => !isDisabledMonth(year, i) && handleMonthSelect(i)}
            onKeyDown={(e) =>
              !isDisabledMonth(year, i) &&
              (e.key === "Enter" || e.key === " ") &&
              handleMonthSelect(i)
            }
          >
            {new Date(0, i).toLocaleString("default", { month: "short" })}
          </div>
        ))}
      </div>
    </div>
  );
}

MonthView.propTypes = {
  year: PropTypes.number.isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  setCurrentDate: PropTypes.func.isRequired,
  handleMonthSelect: PropTypes.func.isRequired,
  isDisabledMonth: PropTypes.func.isRequired,
  onYearClick: PropTypes.func,
};
