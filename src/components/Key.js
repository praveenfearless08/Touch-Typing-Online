import React from "react";
import "./Key.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHand } from "@fortawesome/free-solid-svg-icons";

const Key = ({ value, isActive, pressed, onClick }) => (
  <div
    className={`key ${isActive ? "active" : ""} ${pressed ? "pressed" : ""}`}
    onClick={() => onClick(value)}
  >
    {value.toUpperCase()}
    {isActive && (
      <span className="next-key">
        <FontAwesomeIcon icon={faHand} />
      </span>
    )}
  </div>
);

export default Key;
