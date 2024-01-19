"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [firstValue, setFirstValue] = useState(1);
  const [secondValue, setSecondValue] = useState(2);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [justStarted, setJustStarted] = useState(true);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [startGame, setStartGame] = useState(false);
  const [gameTimer, setGameTimer] = useState(60); // 60 seconds
  const valueTrackerTemp: boolean[][] = [];
  const [valueTracker, setValueTracker] = useState(valueTrackerTemp);
  const maximumNumber = 12;

  useEffect(() => {
    initializeValueTracker();
  }, []);

  useEffect(() => {
    let timerId;
    if (startGame && gameTimer > 0) {
      timerId = setInterval(() => {
        setGameTimer((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [startGame, gameTimer]);

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  const handleStartGame = () => {
    initializeValueTracker();
    generateNewQuestion();
    setStartGame(true);
  };

  const initializeValueTracker = () => {
    const initialValueTracker: boolean[][] = [];
    for (var i = 0; i <= maximumNumber; i++) {
      initialValueTracker.push([]);
      for (var j = 0; j <= maximumNumber; j++) {
        initialValueTracker[i].push(false);
      }
    }
    setValueTracker(initialValueTracker);
  };

  const checkAnswer = () => {
    const product = firstValue * secondValue;
    const userEnteredValue = parseInt(userAnswer, 10);

    setJustStarted(false);
    if (!isNaN(userEnteredValue) && userEnteredValue === product) {
      setIsCorrect(true);
      setScore(score + 1);
    } else {
      setIsCorrect(false);
      setScore(Math.max(score - 1, 0));
    }
    setTimeout(generateNewQuestion, 500);
  };

  const generateNewQuestion = () => {
    if (count >= (maximumNumber + 1) * (maximumNumber + 1) || gameTimer <= 0) {
      alert(`Game Over! You scored ${score}/${count}`);
      setGameTimer(60); // Reset the timer to 60 seconds
      setStartGame(false);
      return;
    }

    // Generate new random values for the flash card
    var newFirstValue = Math.floor(Math.random() * (maximumNumber + 1));
    var newSecondValue = Math.floor(Math.random() * (maximumNumber + 1));

    var used = true;

    while (used) {
      if (valueTracker[newFirstValue][newSecondValue] == false) {
        used = false;
        valueTracker[newFirstValue][newSecondValue] = true;
        setValueTracker(valueTracker);
      } else {
        newFirstValue = Math.floor(Math.random() * (maximumNumber + 1));
        newSecondValue = Math.floor(Math.random() * (maximumNumber + 1));
      }
    }

    setCount(count + 1);

    // Reset states
    setFirstValue(newFirstValue);
    setSecondValue(newSecondValue);
    setUserAnswer("");
    setIsCorrect(false);
    setJustStarted(true);
  };

  const handleEndGame = () => {
    setGameTimer(60); // Reset the timer to 60 seconds
    setStartGame(false);
    setCount(0);
    setScore(0);
  };

  return (
    <main>
      {startGame ? (
        <div>
          <p>
            Score: {score}/{count}
          </p>
          <p>Time remaining: {gameTimer} seconds</p>
          <p>
            {firstValue} x {secondValue} =
          </p>
          <input
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your answer"
          />
          <button onClick={generateNewQuestion}>Next Question</button>
          {!justStarted && (
            <p>
              {isCorrect
                ? `Correct!`
                : `Incorrect. It's ${firstValue * secondValue}.`}
            </p>
          )}
        </div>
      ) : (
        <button onClick={handleStartGame}>Start Game</button>
      )}
    </main>
  );
}
