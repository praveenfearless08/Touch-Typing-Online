import React, { useState, useEffect } from "react";
import Key from "./Key";
import "./Typing.css";
import red from "../sounds/red.mp3";
import wrong from "../sounds/wrong.mp3";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const keys = ["a", "s", "d", "f", "j", "k", "l", ";"];
const countdownDuration = 5 * 60;

const Typing = () => {
  const correctAudio = new Audio(red);
  const wrongAudio = new Audio(wrong);
  const [nextKey, setNextKey] = useState("");
  const [keyPressCount, setKeyPressCount] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [pressedKey, setPressedKey] = useState("");
  const [timer, setTimer] = useState(countdownDuration);
  const [page, setPage] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [correctKeyPressCount, setCorrectKeyPressCount] = useState(0);

  const getRandomKey = () => {
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  };

  useEffect(() => {
    if (page === true) {
      setIsRunning(true);
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => {
        clearInterval(timerId);
      };
    }
  }, [page]);

  useEffect(() => {
    if (timer === 0 && isRunning) {
      setIsLessonComplete(true);
      setIsRunning(false);
      setAccuracy(Math.floor((keyPressCount / (keyPressCount + 1)) * 100));
    }
  }, [timer, keyPressCount, isRunning]);

  const handleKeyPress = (event) => {
    if (timer === 0) {
      return;
    }

    const typedKey = event.key.toLowerCase();

    if (isRunning === true && keys.includes(typedKey) && typedKey === nextKey) {
      setKeyPressCount(keyPressCount + 1);
      setNextKey(getRandomKey());
      setCorrectKeyPressCount(correctKeyPressCount + 1);

      setPressedKey(typedKey);
      correctAudio.play();
    } else {
      setKeyPressCount(keyPressCount + 1);
      wrongAudio.play();
    }

    setAccuracy(Math.floor((correctKeyPressCount / (keyPressCount + 1)) * 100));
  };

  useEffect(() => {
    setNextKey(getRandomKey());
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [timer, nextKey]);

  const handleKeyClick = (key) => {
    if (timer === 0) {
      return;
    }

    if (isRunning === true && keys.includes(key) && key === nextKey) {
      setKeyPressCount(keyPressCount + 1);
      setNextKey(getRandomKey());
      setCorrectKeyPressCount(correctKeyPressCount + 1);

      setPressedKey(key);
      correctAudio.play();
    } else {
      setKeyPressCount(keyPressCount + 1);
      wrongAudio.play();
    }

    setAccuracy(Math.floor((correctKeyPressCount / (keyPressCount + 1)) * 100));
  };

  const handleStart = () => {
    setPage(true);
    setTimer(countdownDuration);
    setAccuracy(100);
    setKeyPressCount(0);
    setIsRunning(true);
    setPressedKey("");
  };

  return (
    <div className="container">
      {page === false ? (
        <div className="home-page">
          <h1>Welcome to Typing Tutor Application</h1>
          <p>Click on button to start your typing lesson</p>
          <button onClick={handleStart}>Start</button>
          <div className="home-page-note">
            <p>
              Note: This typing lesson is designed to last for 5 minutes for
              testing purposes. By clicking on the "Start" button, you will
              begin the typing lesson. Throughout the lesson, you can monitor
              your accuracy level and track the number of correct letters you
              have pressed. Enjoy improving your typing skills!
            </p>
          </div>
        </div>
      ) : (
        <>
          {isLessonComplete ? (
            <div className="result-page">
              <h1>Typing Lesson Completed</h1>
              <div className="result-count">
                <p>Accuracy: {accuracy}%</p>
                <p>Keypress count: {keyPressCount}</p>
              </div>
              <button
                onClick={() => {
                  setIsLessonComplete(false);
                  handleStart();
                }}
              >
                Start Again
              </button>
            </div>
          ) : (
            <>
              <h1>Touch Typing Application</h1>
              <div className="go-back" onClick={() => setPage(false)}>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>back</span>
              </div>
              <div className="timer">
                <div>
                  Time remaining: {Math.max(0, Math.floor(timer / 60))}:
                  {Math.max(0, Math.floor(timer % 60)).toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                  })}
                  {""}
                  minutes
                </div>
              </div>

              <div className="details">
                <div className="count">
                  <p>Keypress count: {keyPressCount}</p>
                </div>
                <div className="accuracy">
                  <p>Accuracy: {accuracy}%</p>
                </div>
              </div>
              <div className="keyboard">
                {keys.map((key) => (
                  <Key
                    key={key}
                    value={key}
                    isActive={nextKey === key}
                    pressed={pressedKey === key}
                    onClick={handleKeyClick}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Typing;
