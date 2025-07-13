import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import MonthView from "./MonthView";
import YearView from "./YearView";
import DateInput from "./DateInput";

const VIEW = {
  CALENDAR: "calendar",
  MONTH: "month",
  YEAR: "year",
};


function isDateTimeBefore(d1, t1, d2, t2) {
  if (!d1 || !t1 || !d2 || !t2) return false;
  const dt1 = new Date(d1);
  dt1.setHours(t1.ampm ? (t1.ampm === "PM" ? (parseInt(t1.hour, 10) % 12) + 12 : parseInt(t1.hour, 10) % 12) : parseInt(t1.hour, 10));
  dt1.setMinutes(parseInt(t1.minute, 10));
  dt1.setSeconds(0, 0);
  const dt2 = new Date(d2);
  dt2.setHours(t2.ampm ? (t2.ampm === "PM" ? (parseInt(t2.hour, 10) % 12) + 12 : parseInt(t2.hour, 10) % 12) : parseInt(t2.hour, 10));
  dt2.setMinutes(parseInt(t2.minute, 10));
  dt2.setSeconds(0, 0);
  return dt1 < dt2;
}

export default function DateTimeRangePicker({ hour12 = true, minuteStep = 1 }) {
  const today = new Date();
  const [view, setView] = useState(VIEW.CALENDAR);
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const [selecting, setSelecting] = useState("start");

  // Date state only
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Calendar helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const isSameDate = (d, y, m, day) => d && d.getFullYear() === y && d.getMonth() === m && d.getDate() === day;
  const isInRange = (y, m, d) => {
    if (!startDate || !endDate) return false;
    const date = new Date(y, m, d);
    return date > startDate && date < endDate;
  };
  const isDisabledDate = (y, m, d) => {
    if (selecting !== "end" || !startDate) return false;
    const selected = new Date(y, m, d);
    if (selected < startDate) return true;
    return false;
  };
  const isDisabledMonth = (year, month) => {
    if (selecting !== "end" || !startDate) return false;
    return new Date(year, month, 1) < new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  };
  const isDisabledYear = (year) => {
    if (selecting !== "end" || !startDate) return false;
    return year < startDate.getFullYear();
  };

  // Calendar navigation
  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (selecting === "start") {
      setStartDate(selected);
      if (endDate && selected > endDate) {
        setEndDate(null);
      }
    } else if (selecting === "end" && startDate && selected >= startDate) {
      setEndDate(selected);
    }
  };
  const handleMonthChange = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };
  const handleMonthSelect = (month) => {
    if (isDisabledMonth(currentDate.getFullYear(), month)) return;
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    setView(VIEW.CALENDAR);
  };
  const handleYearSelect = (year) => {
    if (isDisabledYear(year)) return;
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setView(VIEW.MONTH);
  };

  // Sync calendar view with selection
  useEffect(() => {
    if (selecting === "start" && startDate) {
      setCurrentDate(new Date(startDate));
    } else if (selecting === "end" && endDate) {
      setCurrentDate(new Date(endDate));
    } else if (selecting === "end" && startDate) {
      setCurrentDate(new Date(startDate));
    }
  }, [selecting, startDate, endDate]);

  // Reset handlers
  const handleClearStart = () => {
    setStartDate(null);
    setEndDate(null);
    setSelecting("start");
  };
  const handleClearEnd = () => {
    setEndDate(null);
    setSelecting("end");
  };

  return (
    <div className="date-time-picker">
      <div className="input-fields">
        <div className="input-pill-group">
          <DateInput
            label="Start"
            selected={selecting === "start"}
            name="date-range-select"
            onChange={() => setSelecting("start")}
            value={startDate ? startDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : null}
            onClear={handleClearStart}
            className="left"
          />
          <DateInput
            label="End"
            selected={selecting === "end"}
            name="date-range-select"
            onChange={() => setSelecting("end")}
            value={endDate ? endDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : null}
            onClear={handleClearEnd}
            className="right"
          />
        </div>
      </div>
      <div className="calendar-time-container">
        <div>
          <div className={`picker-body view-${view}`}>
            {view === VIEW.CALENDAR && (
              <Calendar
                year={currentDate.getFullYear()}
                month={currentDate.getMonth()}
                firstDay={getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())}
                daysInMonth={getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())}
                startDate={startDate}
                endDate={endDate}
                isSameDate={isSameDate}
                isInRange={isInRange}
                isDisabledDate={isDisabledDate}
                handleDateClick={handleDateClick}
                handleMonthChange={handleMonthChange}
                setView={setView}
                VIEW={VIEW}
                currentDate={currentDate}
              />
            )}
            {view === VIEW.MONTH && (
              <MonthView
                year={currentDate.getFullYear()}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                handleMonthSelect={handleMonthSelect}
                isDisabledMonth={isDisabledMonth}
              />
            )}
            {view === VIEW.YEAR && (
              <YearView
                baseYear={Math.floor(currentDate.getFullYear() / 10) * 10}
                years={Array.from({ length: 12 }, (_, i) => Math.floor(currentDate.getFullYear() / 10) * 10 - 1 + i)}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                handleYearSelect={handleYearSelect}
                isDisabledYear={isDisabledYear}
              />
            )}
          </div>
        </div>
      </div>
      {/* Validation message for invalid range */}
      {startDate && endDate && !isDateTimeBefore(startDate, { hour: "12", minute: "00", ampm: "AM" }, endDate, { hour: "12", minute: "00", ampm: "AM" }) && (
        <div className="validation-error" style={{ color: 'red', marginTop: 12 }}>
          End date must be after start date.
        </div>
      )}
    </div>
  );
} 