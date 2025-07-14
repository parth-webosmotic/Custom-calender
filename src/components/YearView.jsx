import React from "react";
import PropTypes from "prop-types";

export default function YearView({
  baseYear,
  years,
  currentDate,
  setCurrentDate,
  handleYearSelect,
  isDisabledYear,
}) {
  return (
    <div className="year-view">
      <div className="header">
        <div
          className="nav-btn"
          role="button"
          tabIndex={0}
          aria-label="Previous decade"
          onClick={() =>
            setCurrentDate(new Date(currentDate.setFullYear(baseYear - 10)))
          }
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            setCurrentDate(new Date(currentDate.setFullYear(baseYear - 10)))
          }
        >
          ❮
        </div>
        <div>{`${baseYear} - ${baseYear + 9}`}</div>
        <div
          className="nav-btn"
          role="button"
          tabIndex={0}
          aria-label="Next decade"
          onClick={() =>
            setCurrentDate(new Date(currentDate.setFullYear(baseYear + 10)))
          }
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            setCurrentDate(new Date(currentDate.setFullYear(baseYear + 10)))
          }
        >
          ❯
        </div>
      </div>
      <div className="year-grid">
        {years.map((year) => (
          <div
            key={year}
            className={`year${
              isDisabledYear(year) ? " disabled" : ""
            }${
              currentDate.getFullYear() === year ? " selected" : ""
            }`}
            role="button"
            tabIndex={isDisabledYear(year) ? -1 : 0}
            aria-disabled={isDisabledYear(year)}
            onClick={() => !isDisabledYear(year) && handleYearSelect(year)}
            onKeyDown={(e) =>
              !isDisabledYear(year) &&
              (e.key === "Enter" || e.key === " ") &&
              handleYearSelect(year)
            }
          >
            {year}
          </div>
        ))}
      </div>
    </div>
  );
}

YearView.propTypes = {
  baseYear: PropTypes.number.isRequired,
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  setCurrentDate: PropTypes.func.isRequired,
  handleYearSelect: PropTypes.func.isRequired,
  isDisabledYear: PropTypes.func.isRequired,
};
