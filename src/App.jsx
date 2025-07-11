import React, { useState, useEffect } from "react";
import "./App.css";
import Calendar from "./components/Calendar";
import MonthView from "./components/MonthView";
import YearView from "./components/YearView";
import DateInput from "./components/DateInput";

const VIEW = {
  CALENDAR: "calendar",
  MONTH: "month",
  YEAR: "year",
};

export default function App() {
  const today = new Date();
  const [view, setView] = useState(VIEW.CALENDAR);
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selecting, setSelecting] = useState("start");

  // Remove time picker state
  // const [startHour, setStartHour] = useState("12");
  // const [startMinute, setStartMinute] = useState("00");
  // const [startPeriod, setStartPeriod] = useState("AM");
  // const [endHour, setEndHour] = useState("12");
  // const [endMinute, setEndMinute] = useState("00");
  // const [endPeriod, setEndPeriod] = useState("AM");

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const isSameDate = (d, y, m, day) =>
    d && d.getFullYear() === y && d.getMonth() === m && d.getDate() === day;

  const isInRange = (y, m, d) => {
    if (!startDate || !endDate) return false;
    const date = new Date(y, m, d);
    return date > startDate && date < endDate;
  };

  const isDisabledDate = (y, m, d) => {
    if (selecting !== "end" || !startDate) return false;
    const selected = new Date(y, m, d);
    return selected < startDate;
  };

  const isDisabledMonth = (year, month) => {
    if (selecting !== "end" || !startDate) return false;
    return (
      new Date(year, month, 1) <
      new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    );
  };

  const isDisabledYear = (year) => {
    if (selecting !== "end" || !startDate) return false;
    return year < startDate.getFullYear();
  };

  const handleDateClick = (day) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (selecting === "start") {
      setStartDate(selected);
      if (endDate && selected > endDate) {
        setEndDate(null);
      }
    } else if (startDate && selected >= startDate) {
      setEndDate(selected);
      setSelecting("end");
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

  // Update formatDateTime to use new state
  const formatDateTime = (date, hour, minute, period) => {
    if (!date) return "";
    const d = date.toLocaleDateString("en-GB");
    return `${d} ${hour}:${minute} ${period}`;
  };

  useEffect(() => {
    if (selecting === "start" && startDate) {
      setCurrentDate(new Date(startDate));
    } else if (selecting === "end" && endDate) {
      setCurrentDate(new Date(endDate));
    } else if (selecting === "end" && startDate) {
      setCurrentDate(new Date(startDate));
    }
  }, [selecting, startDate, endDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  const baseYear = Math.floor(currentDate.getFullYear() / 10) * 10;
  const years = Array.from({ length: 12 }, (_, i) => baseYear - 1 + i);

  return (
    <div className="app-center">
      <div className="date-time-picker">
        <div className="input-fields">
          <div className="input-pill-group">
            <DateInput
              label="Start"
              selected={selecting === "start"}
              name="date-range-select"
              onChange={() => setSelecting("start")}
              value={
                startDate
                  ? formatDateTime(
                      startDate,
                      // startHour, // Removed
                      // startMinute, // Removed
                      // startPeriod // Removed
                      null, // Placeholder for now
                      null // Placeholder for now
                    )
                  : null
              }
              onClear={() => {
                setStartDate(null);
                setEndDate(null);
                setSelecting("start");
              }}
              className="left"
            />
            <DateInput
              label="End"
              selected={selecting === "end"}
              name="date-range-select"
              onChange={() => setSelecting("end")}
              value={
                endDate
                  ? formatDateTime(endDate, null, null, null) // Placeholder for now
                  : null
              }
              onClear={() => {
                setEndDate(null);
                setSelecting("end");
              }}
              className="right"
            />
          </div>
        </div>
        <div className="calendar-time-container">
          <div>
            <div className={`picker-body view-${view}`}>
              {view === VIEW.CALENDAR && (
                <Calendar
                  year={year}
                  month={month}
                  firstDay={firstDay}
                  daysInMonth={daysInMonth}
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
                  year={year}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  handleMonthSelect={handleMonthSelect}
                  isDisabledMonth={isDisabledMonth}
                />
              )}
              {view === VIEW.YEAR && (
                <YearView
                  baseYear={baseYear}
                  years={years}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  handleYearSelect={handleYearSelect}
                  isDisabledYear={isDisabledYear}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
