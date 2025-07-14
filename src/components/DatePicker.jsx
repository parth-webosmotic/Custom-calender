import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import DateInput from "./DateInput";
import PropTypes from "prop-types";
import MonthView from "./MonthView";
import YearView from "./YearView";

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

export default function DatePicker({ controls = ["date"], hour12 = true, minuteStep = 1 }) {
  // ... existing code ...
  // At the top of the return, add a switch/case or if/else to select the correct picker UI
  // For now, keep the existing logic for 'date' and 'range' as the default
  // Later, we will refactor the internals for each mode

  // Determine picker mode
  let mode = "date";
  if (Array.isArray(controls)) {
    if (controls.includes("range")) mode = "range";
    else if (controls.includes("month") && controls.includes("year")) mode = "month-year";
    else if (controls.includes("month")) mode = "month";
    else if (controls.includes("year")) mode = "year";
    else if (controls.includes("date")) mode = "date";
  } else if (typeof controls === "string") {
    mode = controls;
  }

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

  // Add state for month picker
  const [monthPickerYear, setMonthPickerYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Add state for year picker
  const [yearPickerYear, setYearPickerYear] = useState(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Add state for month-year picker
  const [monthYearPickerYear, setMonthYearPickerYear] = useState(new Date().getFullYear());
  const [monthYearPickerMonth, setMonthYearPickerMonth] = useState(new Date().getMonth());
  const [monthYearPickerView, setMonthYearPickerView] = useState('month'); // 'month' or 'year'

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

  // For year picker (decade grid)
  const yearPickerDecadeStart = Math.floor(yearPickerYear / 10) * 10;
  const yearPickerYears = Array.from({ length: 12 }, (_, i) => yearPickerDecadeStart - 1 + i);

  const monthYearPickerDecadeStart = Math.floor(monthYearPickerYear / 10) * 10;
  const monthYearPickerYears = Array.from({ length: 12 }, (_, i) => monthYearPickerDecadeStart - 1 + i);

  if (mode === "date") {
    return (
      <div className="calendar-grid-container">
        <div className="calendar-grid-item">
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
              if (view === VIEW.MONTH) setFullCalendarView(VIEW.MONTH);
              if (view === VIEW.YEAR) setFullCalendarView(VIEW.YEAR);
              if (view === VIEW.CALENDAR) setFullCalendarView(VIEW.CALENDAR);
            }}
            VIEW={VIEW}
            currentDate={currentDate}
            view={fullCalendarView}
          />
          <div style={{fontSize: '0.95em', marginTop: 8}}>
            Selected: {startDate ? `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}` : 'None'}
            {endDate && ` - ${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`}
          </div>
        </div>
      </div>
    );
  } else if (mode === "range") {
    return (
      <div className="calendar-grid-container">
        <div className="calendar-grid-item">
          {/* Pill-style input group for Start/End selection */}
          <div className="input-pill-group range-wide" style={{ marginBottom: 16 }}>
            <DateInput
              label="Start"
              selected={selecting === "start"}
              name="date-range-select"
              onChange={() => setSelecting("start")}
              value={startDate ? startDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) : null}
              onClear={handleClearStart}
              className="left"
            />
            <DateInput
              label="End"
              selected={selecting === "end"}
              name="date-range-select"
              onChange={() => setSelecting("end")}
              value={endDate ? endDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) : null}
              onClear={handleClearEnd}
              className="right"
            />
          </div>
          {/* Render correct picker based on fullCalendarView */}
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
                if (view === VIEW.MONTH) setFullCalendarView(VIEW.MONTH);
                if (view === VIEW.YEAR) setFullCalendarView(VIEW.YEAR);
                if (view === VIEW.CALENDAR) setFullCalendarView(VIEW.CALENDAR);
              }}
              VIEW={VIEW}
              currentDate={currentDate}
              view={fullCalendarView}
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
          <div style={{fontSize: '0.95em', marginTop: 8}}>
            Selected: {startDate ? `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}` : 'None'}
            {endDate && ` - ${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`}
          </div>
        </div>
      </div>
    );
  } else if (mode === "month") {
    return (
      <div className="calendar-grid-container">
        <div className="calendar-grid-item">
          <MonthView
            year={monthPickerYear}
            currentDate={new Date(monthPickerYear, selectedMonth)}
            setCurrentDate={(date) => {
              setMonthPickerYear(date.getFullYear());
              setSelectedMonth(date.getMonth());
            }}
            handleMonthSelect={(month) => setSelectedMonth(month)}
            isDisabledMonth={() => false}
          />
          <div style={{fontSize: '0.95em', marginTop: 8}}>
            Selected: {selectedMonth !== null ? `${selectedMonth + 1}/${monthPickerYear}` : 'None'}
          </div>
        </div>
      </div>
    );
  } else if (mode === "year") {
    return (
      <div className="calendar-grid-container">
        <div className="calendar-grid-item">
          <YearView
            baseYear={yearPickerDecadeStart}
            years={yearPickerYears}
            currentDate={new Date(selectedYear, 0)}
            setCurrentDate={(date) => {
              setYearPickerYear(date.getFullYear());
            }}
            handleYearSelect={(year) => setSelectedYear(year)}
            isDisabledYear={() => false}
          />
          <div style={{fontSize: '0.95em', marginTop: 8}}>
            Selected: {selectedYear}
          </div>
        </div>
      </div>
    );
  } else if (mode === "month-year") {
    return (
      <div className="calendar-grid-container">
        <div className="calendar-grid-item">
          {monthYearPickerView === 'month' ? (
            <MonthView
              year={monthYearPickerYear}
              currentDate={new Date(monthYearPickerYear, monthYearPickerMonth)}
              setCurrentDate={(date) => {
                setMonthYearPickerYear(date.getFullYear());
                setMonthYearPickerMonth(date.getMonth());
              }}
              handleMonthSelect={(month) => setMonthYearPickerMonth(month)}
              isDisabledMonth={() => false}
              onYearClick={() => setMonthYearPickerView('year')}
            />
          ) : (
            <YearView
              baseYear={monthYearPickerDecadeStart}
              years={monthYearPickerYears}
              currentDate={new Date(monthYearPickerYear, 0)}
              setCurrentDate={(date) => setMonthYearPickerYear(date.getFullYear())}
              handleYearSelect={(year) => {
                setMonthYearPickerYear(year);
                setMonthYearPickerView('month');
              }}
              isDisabledYear={() => false}
            />
          )}
          <div style={{fontSize: '0.95em', marginTop: 8}}>
            Selected: {monthYearPickerMonth + 1}/{monthYearPickerYear}
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Invalid controls prop</div>;
  }
}

DatePicker.propTypes = {
  controls: PropTypes.arrayOf(PropTypes.string),
  hour12: PropTypes.bool,
  minuteStep: PropTypes.number,
}; 