import React, { useState, useRef, useEffect } from "react";

function pad(num, size = 2) {
  let s = String(num);
  while (s.length < size) s = "0" + s;
  return s;
}

const getHourList = (hour12) => {
  if (hour12) {
    return Array.from({ length: 12 }, (_, i) => pad(i === 0 ? 12 : i));
  } else {
    return Array.from({ length: 24 }, (_, i) => pad(i));
  }
};

const getMinuteList = (step) => {
  return Array.from({ length: 60 / step }, (_, i) => pad(i * step));
};

const ampmList = ["AM", "PM"];

const defaultValueForMode = (hour12) => ({
  hour: hour12 ? "12" : "00",
  minute: "00",
  ampm: hour12 ? "AM" : undefined,
});

const ITEM_HEIGHT = 40; // px, must match CSS
const VISIBLE_ROWS = 5; // odd number, center row is selected
const PADDING_COUNT = Math.floor(VISIBLE_ROWS / 2);

function getPaddedList(list) {
  return [
    ...Array(PADDING_COUNT).fill(""),
    ...list,
    ...Array(PADDING_COUNT).fill(""),
  ];
}

function getIndexFromScroll(scrollTop) {
  return Math.round(scrollTop / ITEM_HEIGHT);
}

function getScrollFromIndex(index) {
  return index * ITEM_HEIGHT;
}

const TimePickerScroller = ({
  value,
  onChange,
  hour12 = false,
  minuteStep = 1,
  showAmPm,
  defaultValue,
  className = "",
  style = {},
  timezoneLabel,
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue || defaultValueForMode(hour12)
  );
  const selected = isControlled ? value : internalValue;

  const hours = getHourList(hour12);
  const minutes = getMinuteList(minuteStep);
  const showAmPmCol = showAmPm !== undefined ? showAmPm : hour12;

  // Padded lists for scrollable columns
  const paddedHours = getPaddedList(hours);
  const paddedMinutes = getPaddedList(minutes);
  const paddedAmPm = showAmPmCol ? getPaddedList(ampmList) : [];

  // Refs for scrollable columns
  const hourRef = useRef();
  const minuteRef = useRef();
  const ampmRef = useRef();

  // Scroll to selected value on mount/change
  useEffect(() => {
    // Helper to scroll a column to a value
    function scrollToValue(ref, list, value) {
      if (!ref.current) return;
      const idx = list.indexOf(value);
      if (idx === -1) return;
      const scrollPos = getScrollFromIndex(idx);
      ref.current.scrollTo({ top: scrollPos, behavior: "auto" });
    }
    scrollToValue(hourRef, hours, selected.hour);
    scrollToValue(minuteRef, minutes, selected.minute);
    if (showAmPmCol) scrollToValue(ampmRef, ampmList, selected.ampm);
  }, [
    selected.hour,
    selected.minute,
    selected.ampm,
    hour12,
    minuteStep,
    showAmPmCol,
  ]);

  // Handle scroll and update selection robustly
  function handleScrollAndSnap(ref, list, type) {
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const idx = getIndexFromScroll(scrollTop);
    const snapPos = getScrollFromIndex(idx);
    ref.current.scrollTo({ top: snapPos, behavior: "smooth" });
    const value = list[idx];
    if (value && value !== selected[type]) {
      const newValue = { ...selected, [type]: value };
      if (!isControlled) setInternalValue(newValue);
      if (onChange) onChange(newValue);
    }
  }

  // Debounce scroll end and always snap and select
  function useRobustDebouncedScroll(ref, list, type) {
    useEffect(() => {
      if (!ref.current || !list) return;
      let timeout;
      const onScroll = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => handleScrollAndSnap(ref, list, type), 120);
      };
      const node = ref.current;
      node.addEventListener("scroll", onScroll);
      return () => {
        node.removeEventListener("scroll", onScroll);
        clearTimeout(timeout);
      };
    }, [ref, list, type]);
  }

  useRobustDebouncedScroll(hourRef, hours, "hour");
  useRobustDebouncedScroll(minuteRef, minutes, "minute");
  useRobustDebouncedScroll(ampmRef, showAmPmCol ? ampmList : null, "ampm");

  // Custom wheel handler for 1-by-1 scroll
  function useStepWheel(ref, list) {
    useEffect(() => {
      if (!ref.current || !list) return;
      const node = ref.current;
      const onWheel = (e) => {
        e.preventDefault();
        const scrollTop = node.scrollTop;
        const idx = getIndexFromScroll(scrollTop);
        // For short lists (like AM/PM), clamp nextIdx to only valid value indices
        let minIdx = 0;
        let maxIdx = list.length - 1;
        // If list is ampmList (2 values), only allow 0 or 1
        if (list.length === 2) {
          minIdx = 0;
          maxIdx = 1;
        }
        let nextIdx = idx + (e.deltaY > 0 ? 1 : -1);
        nextIdx = Math.max(minIdx, Math.min(maxIdx, nextIdx));
        node.scrollTo({ top: getScrollFromIndex(nextIdx), behavior: "smooth" });
      };
      node.addEventListener("wheel", onWheel, { passive: false });
      return () => node.removeEventListener("wheel", onWheel);
    }, [ref, list]);
  }

  useStepWheel(hourRef, hours);
  useStepWheel(minuteRef, minutes);
  useStepWheel(ampmRef, showAmPmCol ? ampmList : null);

  // Click handler (for accessibility)
  const handleSelect = (type, val) => {
    if (!val) return;
    const newValue = { ...selected, [type]: val };
    if (!isControlled) setInternalValue(newValue);
    if (onChange) onChange(newValue);
    // Scroll to the selected value
    let ref;
    if (type === "hour") {
      ref = hourRef;
    } else if (type === "minute") {
      ref = minuteRef;
    } else if (type === "ampm") {
      ref = ampmRef;
    }
    if (ref) {
      let idx;
      if (type === "hour") idx = hours.indexOf(val);
      else if (type === "minute") idx = minutes.indexOf(val);
      else if (type === "ampm") idx = ampmList.indexOf(val);
      if (idx !== -1 && ref.current) {
        ref.current.scrollTo({
          top: getScrollFromIndex(idx),
          behavior: "smooth",
        });
      }
    }
  };

  // Calculate the centered index for a padded list
  function getCenteredIndex(ref) {
    if (!ref.current) return PADDING_COUNT;
    const scrollTop = ref.current.scrollTop;
    return getIndexFromScroll(scrollTop);
  }

  // Get the currently centered value for each column
  const centeredHourIdx = getCenteredIndex(hourRef);
  const centeredMinuteIdx = getCenteredIndex(minuteRef);
  const centeredAmPmIdx = showAmPmCol ? getCenteredIndex(ampmRef) : null;

  // Render a column, highlighting only the centered value
  function renderColumn(list, paddedList, ref, type) {
    let centeredIdx;
    if (type === "hour") centeredIdx = centeredHourIdx;
    else if (type === "minute") centeredIdx = centeredMinuteIdx;
    else if (type === "ampm") centeredIdx = centeredAmPmIdx;
    return (
      <div
        className={`scroller-column ${type}`}
        ref={ref}
        style={{ maxHeight: ITEM_HEIGHT * VISIBLE_ROWS, minWidth: 60 }}
        tabIndex={0}
      >
        {paddedList.map((val, i) => (
          <div
            key={i + "-" + val}
            className={`scroller-item${i === centeredIdx ? " selected" : ""}`}
            style={{ height: ITEM_HEIGHT }}
            onClick={() => handleSelect(type, val)}
          >
            {val}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`timepicker-scroller ${className}`} style={style}>
      <div className="scroller-columns">
        {renderColumn(hours, paddedHours, hourRef, "hour")}
        {renderColumn(minutes, paddedMinutes, minuteRef, "minute")}
        {showAmPmCol && renderColumn(ampmList, paddedAmPm, ampmRef, "ampm")}
      </div>
      {timezoneLabel && <div className="timezone-label">{timezoneLabel}</div>}
    </div>
  );
};

export default TimePickerScroller;
