import { useEffect, useRef, useState } from "react";

const pickNumber = (numbers: number[]): number => {
  return numbers[Math.floor(Math.random() * numbers.length)];
};

const numbers1 = [/*2, 3, 4, 5, */ 6, 7, 8 /* 9 */];
const numbers2 = numbers1;

const QUIZZ_SIZE = 30;

export const Quizz = () => {
  const timer = useTimer();
  const [number, setNumber] = useState("");
  const [randomNumber1, setRandomNumber1] = useState(pickNumber(numbers1));
  const [randomNumber2, setRandomNumber2] = useState(pickNumber(numbers2));
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const scoreRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const finish = () => {
    timer.stop();
    setDone(true);
    const score = computeScore(count + 1, timer.elapsedTimeInSeconds);
    scoreRef.current = score;
    registerScore(score);
    const highScores = getHighscore();
    setScores(highScores);
  };

  const restart = () => {
    timer.clear();
    setDone(false);
    setNumber("");
    setCount(0);
    setRandomNumber1(pickNumber(numbers1));
    setRandomNumber2(pickNumber(numbers2));
  };

  const nextNumbers = () => {
    console.log("nextNumbers");
    setCount((count) => count + 1);
    setNumber("");
    setRandomNumber1(pickNumber(numbers1));
    setRandomNumber2(pickNumber(numbers2));
    if (count + 1 === QUIZZ_SIZE) {
      finish();
    }
  };

  const onChange = (input: string) => {
    if (timer.status !== "running") {
      timer.start();
    }

    const number = sanitizeInput(input);
    setNumber(number);

    console.log(isInputValid(number), number);

    if (isInputValid(number)) {
      console.log("Called");
      nextNumbers();
    }
  };

  const isInputValid = (number: string) => {
    return parseInt(number) === randomNumber1 * randomNumber2;
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  if (done) {
    return (
      <div className="quizz-container">
        <div style={{ fontSize: 50 }}>{scoreRef.current}</div>
        <div style={{ color: "#888" }}>
          <b>{count}</b> multiplication in{" "}
          <b>{formatDuration(timer.elapsedTimeInSeconds)}</b>
        </div>
        <div className="highscore">
          {scores.map((score, i) => (
            <div
              key={`${score}:${i}`}
              className="score"
              style={{
                ...(score === scoreRef.current
                  ? { color: "red", fontWeight: "bold", fontSize: 18 }
                  : {}),
                background: i % 2 === 0 ? "#EEE" : "transparent",
              }}
            >
              {i + 1} - {score}
            </div>
          ))}
        </div>
        <button className="restartButton" onClick={restart}>
          restart
        </button>
      </div>
    );
  }

  return (
    <div className="quizz-container">
      <div className="time">
        {count} / {QUIZZ_SIZE} - {formatDuration(timer.elapsedTimeInSeconds)}
      </div>
      <div className="question">
        <span>{randomNumber1}</span> <span style={{ color: "#888" }}>×</span>{" "}
        <span>{randomNumber2}</span>
      </div>
      <input
        ref={inputRef}
        value={number}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const useTimer = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState(new Date());
  const [status, setStatus] = useState<"stopped" | "running">("stopped");
  const elapsedTime = startTime
    ? (endTime.valueOf() - startTime.valueOf()) / 1000
    : 0;
  const timeoutRef = useRef<number | undefined>();

  const tick = () => {
    setEndTime(new Date());
    timeoutRef.current = window.setTimeout(tick, 1000);
  };

  return {
    elapsedTimeInSeconds: elapsedTime,
    start: () => {
      setStatus("running");
      setStartTime(new Date());
      tick();
    },
    stop: () => {
      window.clearTimeout(timeoutRef.current);
      setStatus("stopped");
    },
    clear: () => {
      setStatus("stopped");
      setStartTime(new Date());
      setEndTime(new Date());
      window.clearTimeout(timeoutRef.current);
    },
    status,
  };
};

const sanitizeInput = (input: string) => {
  return input
    .replace(/&/g, "1")
    .replace(/é/g, "2")
    .replace(/"/g, "3")
    .replace(/'/g, "4")
    .replace(/\(/g, "5")
    .replace(/§/g, "6")
    .replace(/è/g, "7")
    .replace(/!/g, "8")
    .replace(/ç/g, "9")
    .replace(/à/g, "0")
    .replace(/[^0-9]/g, "");
};

const computeScore = (count: number, elapsedTime: number) => {
  return Math.floor((count / (elapsedTime + 4)) * 1000);
};

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}m${Math.floor(seconds) % 60}s`;

const getHighscore = (): number[] => {
  return JSON.parse(localStorage.getItem("highscore") || "[]");
};

const registerScore = (score: number) => {
  const scores = getHighscore();
  scores.push(score);
  scores.sort((a, b) => b - a);
  localStorage.setItem(
    "highscore",
    JSON.stringify(Array.from(new Set(scores)).slice(0, 10))
  );
};
