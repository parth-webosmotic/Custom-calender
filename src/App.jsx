import React from "react";
import "./App.css";
import DateTimeRangePicker from "./components/DateTimeRangePicker";

export default function App() {
  return (
    <div className="app-center">
      <DateTimeRangePicker hour12={true} minuteStep={1} />
    </div>
  );
}
