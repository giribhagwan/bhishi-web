import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Spinner.css";

const socket = io("http://localhost:5000");

const SpinnerPage = () => {
  const [spinResult, setSpinResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const members = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ];
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F9ED69",
    "#F08A5D",
    "#B83B5E",
  ];

  useEffect(() => {
    console.log("Connecting to socket...");

    socket.on("spinState", (state) => {
      setIsSpinning(state.isSpinning);
      setSpinResult(state.result);
    });

    socket.on("spinStart", (data) => {
      console.log("Spin started:", data);
      setIsSpinning(true);
      setRotation(data.rotation);
      setSpinResult(null);
    });

    socket.on("spinResult", (data) => {
      console.log("Spin result received:", data);
      setSpinResult(data.result);
      setIsSpinning(false);
    });

    return () => {
      console.log("Disconnecting from socket...");
      socket.off("spinState");
      socket.off("spinStart");
      socket.off("spinResult");
    };
  }, []);

  const requestSpin = () => {
    if (!isSpinning) {
      console.log("Requesting spin...");
      socket.emit("requestSpin");
    }
  };

  return (
    <div className="spinner-page">
      <h1>BHISHI Spinner</h1>
      <div className="spinner-container">
        <div className="spinner-outer">
          <div
            className="spinner-wheel"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {members.map((member, index) => (
              <div
                key={index}
                className="section"
                style={{
                  transform: `rotate(${index * (360 / members.length)}deg)`,
                  backgroundColor: colors[index % colors.length],
                }}
              >
                <span
                  style={{
                    transform: `rotate(${-index * (360 / members.length)}deg)`,
                  }}
                >
                  {member}
                </span>
              </div>
            ))}
          </div>
          <div className="spinner-center"></div>
          <div className="spinner-arrow"></div>
        </div>
        <button
          className="spin-button"
          onClick={requestSpin}
          disabled={isSpinning}
        >
          {isSpinning ? "Spinning..." : "SPIN"}
        </button>
        {spinResult && <p className="result">Selected: {spinResult}</p>}
      </div>
    </div>
  );
};

export default SpinnerPage;
