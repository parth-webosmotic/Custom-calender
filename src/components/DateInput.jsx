import React from "react";
import PropTypes from "prop-types";

export default function DateInput({
  label,
  value,
  onClear,
  className,
  selected,
  name,
  onChange,
}) {
  return (
    <label
      className={`input-pill${className ? " " + className : ""}${
        selected ? " active" : ""
      }`}
      style={{ outline: "none", position: "relative" }}
      onClick={onChange}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onChange}
        style={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0,
        }}
        aria-label={label}
      />
      {/* Sliding highlight for selected */}
      {selected && <div className="pill-highlight" />}
      <span className="pill-content">
        <div className="pill-label">{label}</div>
        <div className="pill-value-row">
          {value ? (
            <>
              <span className="pill-datetime-inline">{value}</span>
              <span
                className="pill-clear"
                tabIndex={0}
                role="button"
                aria-label="Clear date"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onClear();
                  }
                }}
              >
                ×
              </span>
            </>
          ) : (
            <span className="pill-placeholder">Please select</span>
          )}
        </div>
      </span>
    </label>
  );
}

DateInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onClear: PropTypes.func.isRequired,
  className: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
