import { useState, useEffect } from "react";

function useTimer(initialValue = 0) {
  const [time, setTime] = useState(initialValue);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;

    if (isTimerActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);

  const startTime = () => {
    setIsTimerActive(true);
  };

  const pauseTime = () => {
    setIsTimerActive(false);
  };

  const resetTime = () => {
    setIsTimerActive(false);
    setTime(initialValue);
  };

  return {
    time,
    isTimerActive,
    startTime,
    pauseTime,
    resetTime,
  };
}

export default useTimer;
