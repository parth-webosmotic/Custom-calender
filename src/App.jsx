import React from "react";
import "./App.css";
import DateTimeRangePicker from "./components/DateTimeRangePicker";

export default function App() {
  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <DateTimeRangePicker hour12={true} minuteStep={1} />
    </div>
  );
}
