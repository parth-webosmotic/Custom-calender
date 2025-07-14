import React, { useState } from "react";
import PropTypes from "prop-types";

export default function Calendar({
  mode = "calendar", // 'month', 'month-year', or 'calendar' (default)
  value,
  onChange,
  // Backward compatibility props
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
  view, // NEW: allow parent to control view for month-year mode
  ...rest
}) {
  // Internal state for month/year pickers if not controlled
  const [internalDate, setInternalDate] = useState(
    value?.year && value?.month !== undefined
      ? new Date(value.year, value.month)
      : new Date()
  );
  const date = value?.year && value?.month !== undefined
    ? new Date(value.year, value.month)
    : internalDate;
  const displayYear = date.getFullYear();
  const displayMonth = date.getMonth();

  // For month-year mode, use parent view if provided, else fallback to internal state
  const [monthYearInternalView, setMonthYearInternalView] = useState("month");
  const effectiveMonthYearView = view || monthYearInternalView;

  // Month Picker Mode
  if (mode === "month") {
    return (
      <div className="month-view">
        <div className="header">
          <div
            className="nav-btn"
            role="button"
            tabIndex={0}
            aria-label="Previous year"
            onClick={() => {
              const newDate = new Date(displayYear - 1, displayMonth);
              setInternalDate(newDate);
              onChange && onChange({ month: newDate.getMonth() });
            }}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && (() => {
              const newDate = new Date(displayYear - 1, displayMonth);
              setInternalDate(newDate);
              onChange && onChange({ month: newDate.getMonth() });
            })()}
          >
            ❮
          </div>
          <div>{displayYear}</div>
          <div
            className="nav-btn"
            role="button"
            tabIndex={0}
            aria-label="Next year"
            onClick={() => {
              const newDate = new Date(displayYear + 1, displayMonth);
              setInternalDate(newDate);
              onChange && onChange({ month: newDate.getMonth() });
            }}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && (() => {
              const newDate = new Date(displayYear + 1, displayMonth);
              setInternalDate(newDate);
              onChange && onChange({ month: newDate.getMonth() });
            })()}
          >
            ❯
          </div>
        </div>
        <div className="month-grid">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`month${displayMonth === i ? " selected" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => {
                onChange && onChange({ month: i });
                setInternalDate(new Date(displayYear, i));
              }}
              onKeyDown={e => (e.key === "Enter" || e.key === " ") && (() => {
                onChange && onChange({ month: i });
                setInternalDate(new Date(displayYear, i));
              })()}
            >
              {new Date(0, i).toLocaleString("default", { month: "short" })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Month-Year Picker Mode
  if (mode === "month-year") {
    const baseYear = Math.floor(displayYear / 10) * 10;
    const years = Array.from({ length: 12 }, (_, i) => baseYear - 1 + i);
    return (
      <div className="month-year-view">
        {effectiveMonthYearView === "month" && (
          <div className="month-view">
            <div className="header">
              <div
                className="nav-btn"
                role="button"
                tabIndex={0}
                aria-label="Previous year"
                onClick={() => {
                  const newDate = new Date(displayYear - 1, displayMonth);
                  setInternalDate(newDate);
                  onChange && onChange({ month: newDate.getMonth(), year: newDate.getFullYear() });
                }}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && (() => {
                  const newDate = new Date(displayYear - 1, displayMonth);
                  setInternalDate(newDate);
                  onChange && onChange({ month: newDate.getMonth(), year: newDate.getFullYear() });
                })()}
              >
                ❮
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setView ? setView(VIEW.YEAR) : setMonthYearInternalView("year")}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && (setView ? setView(VIEW.YEAR) : setMonthYearInternalView("year"))}
                style={{ cursor: "pointer" }}
              >
                {displayYear}
              </div>
              <div
                className="nav-btn"
                role="button"
                tabIndex={0}
                aria-label="Next year"
                onClick={() => {
                  const newDate = new Date(displayYear + 1, displayMonth);
                  setInternalDate(newDate);
                  onChange && onChange({ month: newDate.getMonth(), year: newDate.getFullYear() });
                }}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && (() => {
                  const newDate = new Date(displayYear + 1, displayMonth);
                  setInternalDate(newDate);
                  onChange && onChange({ month: newDate.getMonth(), year: newDate.getFullYear() });
                })()}
              >
                ❯
              </div>
            </div>
            <div className="month-grid">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className={`month${displayMonth === i ? " selected" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onChange && onChange({ month: i, year: displayYear });
                    setInternalDate(new Date(displayYear, i));
                  }}
                  onKeyDown={e => (e.key === "Enter" || e.key === " ") && (() => {
                    onChange && onChange({ month: i, year: displayYear });
                    setInternalDate(new Date(displayYear, i));
                  })()}
                >
                  {new Date(0, i).toLocaleString("default", { month: "short" })}
                </div>
              ))}
            </div>
          </div>
        )}
        {effectiveMonthYearView === "year" && (
          <div className="year-view">
            <div className="header">
              <div
                className="nav-btn"
                role="button"
                tabIndex={0}
                aria-label="Previous decade"
                onClick={() => {
                  if (onChange) {
                    onChange({ year: baseYear - 10, month: displayMonth, decadeNav: true });
                  } else {
                    setInternalDate(new Date(baseYear - 10, displayMonth));
                  }
                }}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && (
                  onChange ? onChange({ year: baseYear - 10, month: displayMonth, decadeNav: true }) : setInternalDate(new Date(baseYear - 10, displayMonth))
                )}
              >
                ❮
              </div>
              <div>{`${baseYear} - ${baseYear + 9}`}</div>
              <div
                className="nav-btn"
                role="button"
                tabIndex={0}
                aria-label="Next decade"
                onClick={() => {
                  if (onChange) {
                    onChange({ year: baseYear + 10, month: displayMonth, decadeNav: true });
                  } else {
                    setInternalDate(new Date(baseYear + 10, displayMonth));
                  }
                }}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && (
                  onChange ? onChange({ year: baseYear + 10, month: displayMonth, decadeNav: true }) : setInternalDate(new Date(baseYear + 10, displayMonth))
                )}
              >
                ❯
              </div>
            </div>
            <div className="year-grid">
              {years.map((y) => (
                <div
                  key={y}
                  className={`year${displayYear === y ? " selected" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setInternalDate(new Date(y, displayMonth));
                    if (setView) setView(VIEW.MONTH); else setMonthYearInternalView("month");
                    onChange && onChange({ month: displayMonth, year: y });
                  }}
                  onKeyDown={e => (e.key === "Enter" || e.key === " ") && (() => {
                    setInternalDate(new Date(y, displayMonth));
                    if (setView) setView(VIEW.MONTH); else setMonthYearInternalView("month");
                    onChange && onChange({ month: displayMonth, year: y });
                  })()}
                >
                  {y}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: Full Calendar (backward compatible)
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
  mode: PropTypes.oneOf(["calendar", "month", "month-year"]),
  value: PropTypes.object,
  onChange: PropTypes.func,
  // Backward compatibility props
  year: PropTypes.number,
  month: PropTypes.number,
  firstDay: PropTypes.number,
  daysInMonth: PropTypes.number,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  isSameDate: PropTypes.func,
  isInRange: PropTypes.func,
  isDisabledDate: PropTypes.func,
  handleDateClick: PropTypes.func,
  handleMonthChange: PropTypes.func,
  setView: PropTypes.func,
  VIEW: PropTypes.object,
  currentDate: PropTypes.instanceOf(Date),
};
