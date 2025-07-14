import React from "react";
import "./App.css";
import DatePicker from "./components/DatePicker";

export default function App() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", padding: '2rem 0' }}>
      <div className="picker-demo-container">
        <div className="picker-demo-card">
          <h2>Date Picker</h2>
          <DatePicker controls={["date"]} hour12={true} minuteStep={1} />
        </div>
        <div className="picker-demo-card">
          <h2>Month Picker</h2>
          <DatePicker controls={["month"]} hour12={true} minuteStep={1} />
        </div>
        <div className="picker-demo-card">
          <h2>Year Picker</h2>
          <DatePicker controls={["year"]} hour12={true} minuteStep={1} />
        </div>
        <div className="picker-demo-card">
          <h2>Month-Year Picker</h2>
          <DatePicker controls={["month", "year"]} hour12={true} minuteStep={1} />
        </div>
        <div className="picker-demo-card">
          <h2>Range Picker</h2>
          <DatePicker controls={["range"]} hour12={true} minuteStep={1} />
        </div>
      </div>
    </div>
  );
}
