import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
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
  // Example state for month picker
  // const [monthValue, setMonthValue] = useState({ month: new Date().getMonth() });
  // Updated state for month and date picker
  const [monthDateValue, setMonthDateValue] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    date: new Date().getDate(),
  });
  // Add view state for month picker
  const [monthPickerView, setMonthPickerView] = useState("date"); // "month" or "date"
  // Example state for month-year picker
  // State for month-year-date picker
  const [monthYearPickerView, setMonthYearPickerView] = useState("date"); // "year", "month", or "date"
  const [monthYearDateValue, setMonthYearDateValue] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    date: new Date().getDate(),
  });

  // --- Existing calendar logic for backward compatibility ---
  const today = new Date();
  const [fullCalendarView, setFullCalendarView] = useState(VIEW.CALENDAR); // NEW: manage view for full calendar
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const [selecting, setSelecting] = useState("start");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
  useEffect(() => {
    if (selecting === "start" && startDate) {
      setCurrentDate(new Date(startDate));
    } else if (selecting === "end" && endDate) {
      setCurrentDate(new Date(endDate));
    } else if (selecting === "end" && startDate) {
      setCurrentDate(new Date(startDate));
    }
  }, [selecting, startDate, endDate]);
  const handleClearStart = () => {
    setStartDate(null);
    setEndDate(null);
    setSelecting("start");
  };
  const handleClearEnd = () => {
    setEndDate(null);
    setSelecting("end");
  };

  // Handlers for switching views in full calendar
  const handleSetMonthView = () => setFullCalendarView(VIEW.MONTH);
  const handleSetYearView = () => setFullCalendarView(VIEW.YEAR);
  const handleSetCalendarView = () => setFullCalendarView(VIEW.CALENDAR);

  // Handler for selecting a month in month picker view
  const handleFullCalendarMonthSelect = ({ month }) => {
    const newDate = new Date(currentDate.getFullYear(), month);
    setCurrentDate(newDate);
    setFullCalendarView(VIEW.CALENDAR);
  };
  // Handler for selecting a month+year in year picker view
  const handleFullCalendarMonthYearSelect = ({ month, year }) => {
    const newDate = new Date(year, month);
    setCurrentDate(newDate);
    setFullCalendarView(VIEW.CALENDAR);
  };
  // Handler for selecting a year in year picker view
  const handleFullCalendarYearSelect = (year) => {
    const newDate = new Date(year, currentDate.getMonth());
    setCurrentDate(newDate);
    setFullCalendarView(VIEW.MONTH);
  };

  // For year picker (decade grid)
  const decadeStart = Math.floor(currentDate.getFullYear() / 10) * 10;
  const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

  return (
    <div className="calendar-grid-container">
      <div className="calendar-grid-item">
        <h3>Month Picker Example</h3>
        {monthPickerView === "month" ? (
          // Month selection view
          <Calendar
            mode="month"
            value={{ month: monthDateValue.month, year: monthDateValue.year }}
            onChange={({ month, year }) => {
              setMonthDateValue((prev) => ({
                ...prev,
                month: month !== undefined ? month : prev.month,
                year: year !== undefined ? year : prev.year,
              }));
              setMonthPickerView("date");
            }}
          />
        ) : (
          // Date selection view
          <Calendar
            year={monthDateValue.year}
            month={monthDateValue.month}
            firstDay={getFirstDayOfMonth(monthDateValue.year, monthDateValue.month)}
            daysInMonth={getDaysInMonth(monthDateValue.year, monthDateValue.month)}
            startDate={new Date(monthDateValue.year, monthDateValue.month, monthDateValue.date)}
            isSameDate={(d, y, m, day) => d && d.getFullYear() === y && d.getMonth() === m && d.getDate() === day}
            isInRange={() => false}
            isDisabledDate={() => false}
            handleDateClick={(day) => {
              setMonthDateValue((prev) => ({
                ...prev,
                date: day,
              }));
            }}
            handleMonthChange={(offset) => {
              const newMonth = new Date(monthDateValue.year, monthDateValue.month + offset);
              setMonthDateValue((prev) => ({
                ...prev,
                year: newMonth.getFullYear(),
                month: newMonth.getMonth(),
              }));
            }}
            setView={(view) => {
              if (view === VIEW.MONTH) setMonthPickerView("month");
            }}
            VIEW={VIEW}
            currentDate={new Date(monthDateValue.year, monthDateValue.month)}
          />
        )}
        <div style={{fontSize: '0.95em', marginTop: 8}}>
          Selected: {monthDateValue.month + 1}/{monthDateValue.date}/{monthDateValue.year}
        </div>
      </div>
      <div className="calendar-grid-item">
        <h3>Month-Year Picker Example</h3>
        {monthYearPickerView === "year" ? (
          <Calendar
            mode="month-year"
            value={{ month: monthYearDateValue.month, year: monthYearDateValue.year }}
            onChange={({ year, month, decadeNav }) => {
              setMonthYearDateValue((prev) => ({
                ...prev,
                year: year !== undefined ? year : prev.year,
                month: month !== undefined ? month : prev.month,
              }));
              if (!decadeNav) {
                setMonthYearPickerView("month");
              }
            }}
            setView={(view) => {
              if (view === VIEW.MONTH) setMonthYearPickerView("month");
              if (view === VIEW.YEAR) setMonthYearPickerView("year");
            }}
            VIEW={VIEW}
            view={monthYearPickerView}
          />
        ) : monthYearPickerView === "month" ? (
          <Calendar
            mode="month-year"
            value={{ month: monthYearDateValue.month, year: monthYearDateValue.year }}
            onChange={({ month }) => {
              setMonthYearDateValue((prev) => ({ ...prev, month: month !== undefined ? month : prev.month }));
              setMonthYearPickerView("date");
            }}
            setView={(view) => {
              if (view === VIEW.MONTH) setMonthYearPickerView("month");
              if (view === VIEW.YEAR) setMonthYearPickerView("year");
            }}
            VIEW={VIEW}
            view={monthYearPickerView}
          />
        ) : (
          <Calendar
            year={monthYearDateValue.year}
            month={monthYearDateValue.month}
            firstDay={getFirstDayOfMonth(monthYearDateValue.year, monthYearDateValue.month)}
            daysInMonth={getDaysInMonth(monthYearDateValue.year, monthYearDateValue.month)}
            startDate={new Date(monthYearDateValue.year, monthYearDateValue.month, monthYearDateValue.date)}
            isSameDate={(d, y, m, day) => d && d.getFullYear() === y && d.getMonth() === m && d.getDate() === day}
            isInRange={() => false}
            isDisabledDate={() => false}
            handleDateClick={(day) => {
              setMonthYearDateValue((prev) => ({ ...prev, date: day }));
            }}
            handleMonthChange={(offset) => {
              const newMonth = new Date(monthYearDateValue.year, monthYearDateValue.month + offset);
              setMonthYearDateValue((prev) => ({
                ...prev,
                year: newMonth.getFullYear(),
                month: newMonth.getMonth(),
              }));
            }}
            setView={(view) => {
              if (view === VIEW.MONTH) setMonthYearPickerView("month");
              if (view === VIEW.YEAR) setMonthYearPickerView("year");
            }}
            VIEW={VIEW}
            currentDate={new Date(monthYearDateValue.year, monthYearDateValue.month)}
            view={monthYearPickerView}
          />
        )}
        <div style={{fontSize: '0.95em', marginTop: 8}}>
          Selected: {monthYearDateValue.month + 1}/{monthYearDateValue.date}/{monthYearDateValue.year}
        </div>
      </div>
      <div className="calendar-grid-item calendar-grid-full">
        <h3>Full Calendar (Backward Compatible)</h3>
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
            <div className={`picker-body view-${fullCalendarView}`}>
              {fullCalendarView === VIEW.CALENDAR && (
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
                  setView={(view) => {
                    if (view === VIEW.MONTH) handleSetMonthView();
                    else if (view === VIEW.YEAR) handleSetYearView();
                  }}
                  VIEW={VIEW}
                  currentDate={currentDate}
                />
              )}
              {fullCalendarView === VIEW.MONTH && (
                <Calendar
                  mode="month"
                  value={{ month: currentDate.getMonth(), year: currentDate.getFullYear() }}
                  onChange={handleFullCalendarMonthSelect}
                />
              )}
              {fullCalendarView === VIEW.YEAR && (
                <div className="year-view">
                  <div className="header">
                    <div
                      className="nav-btn"
                      role="button"
                      tabIndex={0}
                      aria-label="Previous decade"
                      onClick={() => setCurrentDate(new Date(decadeStart - 10, currentDate.getMonth()))}
                      onKeyDown={e => (e.key === "Enter" || e.key === " ") && setCurrentDate(new Date(decadeStart - 10, currentDate.getMonth()))}
                    >
                      ❮
                    </div>
                    <div>{`${decadeStart} - ${decadeStart + 9}`}</div>
                    <div
                      className="nav-btn"
                      role="button"
                      tabIndex={0}
                      aria-label="Next decade"
                      onClick={() => setCurrentDate(new Date(decadeStart + 10, currentDate.getMonth()))}
                      onKeyDown={e => (e.key === "Enter" || e.key === " ") && setCurrentDate(new Date(decadeStart + 10, currentDate.getMonth()))}
                    >
                      ❯
                    </div>
                  </div>
                  <div className="year-grid">
                    {years.map((y) => (
                      <div
                        key={y}
                        className={`year${currentDate.getFullYear() === y ? " selected" : ""}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleFullCalendarYearSelect(y)}
                        onKeyDown={e => (e.key === "Enter" || e.key === " ") && handleFullCalendarYearSelect(y)}
                      >
                        {y}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {startDate && endDate && !isDateTimeBefore(startDate, { hour: "12", minute: "00", ampm: "AM" }, endDate, { hour: "12", minute: "00", ampm: "AM" }) && (
          <div className="validation-error" style={{ color: 'red', marginTop: 12 }}>
            End date must be after start date.
          </div>
        )}
      </div>
    </div>
  );
} 