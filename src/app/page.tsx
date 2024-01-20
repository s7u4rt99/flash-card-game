"use client";

import { useState, useEffect } from "react";
import { GameMode } from "../../utils/enums/gameMode";

export default function Home() {
  const [firstValue, setFirstValue] = useState(1);
  const [secondValue, setSecondValue] = useState(2);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [justStarted, setJustStarted] = useState(true);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [startGame, setStartGame] = useState(false);
  const gameTime = 10;
  const [gameTimer, setGameTimer] = useState(gameTime);
  const [gameMode, setGameMode] = useState(GameMode.Multiplication);
  const [answer, setAnswer] = useState(0);
  const [valueTracker, setValueTracker] = useState<boolean[][]>([]);
  const maximumNumber = 12;

  useEffect(() => {
    initializeValueTracker();
  }, [startGame]);

  // stopwatch timer code
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (startGame) {
      timerId = setInterval(() => {
        if (gameTimer <= 0) {
          clearInterval(timerId);
          return;
        }
        setGameTimer((prevGameTimer) => prevGameTimer - 1);
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

  const handleStartGame = (gameMode: GameMode) => {
    setGameMode(gameMode);
    setCount(0);
    setScore(0);
    initializeValueTracker();
    generateNewQuestion(gameMode);
    setStartGame(true);
  };

  const handleEndGame = (finalScore: number = score) => {
    alert(`Game Over! You scored ${finalScore}/${count}`);
    setGameTimer(gameTime);
    setStartGame(false);
    setCount(0);
    setScore(0);
  };

  // uses an array of arrays of booleans to check whether the pair of numbers has been used before
  const initializeValueTracker = () => {
    const initialValueTracker: boolean[][] = [];
    setValueTracker(initialValueTracker);

    for (var i = 0; i <= maximumNumber; i++) {
      initialValueTracker.push([]);
      for (var j = 0; j <= maximumNumber; j++) {
        initialValueTracker[i].push(false);
      }
    }
  };

  const checkAnswer = () => {
    const userEnteredValue = parseFloat(userAnswer);
    setJustStarted(false);
    let newScore = score;
    if (!isNaN(userEnteredValue) && userEnteredValue === answer) {
      setIsCorrect(true);
      newScore = score + 1;
      setScore(newScore);
    } else {
      setIsCorrect(false);
      newScore = Math.max(score - 1, 0);
      setScore(newScore);
    }

    setTimeout(() => generateNewQuestion(undefined, newScore), 500);
  };

  const generateNewQuestion = (
    mode: GameMode = gameMode,
    currentScore: number = score
  ) => {
    if (count >= (maximumNumber + 1) * (maximumNumber + 1) || gameTimer <= 0) {
      handleEndGame(currentScore);
      return;
    }

    var newFirstValue = Math.floor(Math.random() * (maximumNumber + 1));
    var newSecondValue = Math.floor(Math.random() * (maximumNumber + 1));

    var used = true;
    while (used) {
      if (valueTracker[newFirstValue][newSecondValue] == false) {
        used = false;
        valueTracker[newFirstValue][newSecondValue] = true;
      } else {
        newFirstValue = Math.floor(Math.random() * (maximumNumber + 1));
        newSecondValue = Math.floor(Math.random() * (maximumNumber + 1));
      }
    }

    setCount(count + 1);

    setFirstValue(newFirstValue);
    setSecondValue(newSecondValue);
    setUserAnswer("");
    setIsCorrect(false);
    setJustStarted(true);
    if (mode === GameMode.Addition) {
      setAnswer(newFirstValue + newSecondValue);
    } else if (mode === GameMode.Subtraction) {
      setAnswer(newFirstValue - newSecondValue);
    } else if (mode === GameMode.Division) {
      setAnswer(newFirstValue / newSecondValue);
    } else {
      // assume everything else is multiplication
      setAnswer(newFirstValue * newSecondValue);
    }
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
            {firstValue} {gameMode} {secondValue} =
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
            <p>{isCorrect ? `Correct!` : `Incorrect. It's ${answer}.`}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p>Select the game mode you want to play below:</p>
          <button onClick={() => handleStartGame(GameMode.Addition)}>
            Addition
          </button>
          <button onClick={() => handleStartGame(GameMode.Subtraction)}>
            Subtraction
          </button>
          <button onClick={() => handleStartGame(GameMode.Multiplication)}>
            Multiplication
          </button>
          <button onClick={() => handleStartGame(GameMode.Division)}>
            Division
          </button>
        </div>
      )}
    </main>
  );
}
