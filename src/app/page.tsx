"use client";

import { useState, useEffect, SetStateAction } from "react";
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
  const gameTime = 60;
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
          handleEndGame();
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

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setUserAnswer(e.target.value);
  };

  const handleKeyDown = (e: { key: string }) => {
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
      setTimeout(() => generateNewQuestion(undefined, newScore), 500);
    } else {
      setIsCorrect(false);
      newScore = Math.max(score - 1, 0);
      setScore(newScore);
    }
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
      setAnswer(parseFloat((newFirstValue / newSecondValue).toFixed(2)));
    } else {
      // assume everything else is multiplication
      setAnswer(newFirstValue * newSecondValue);
    }
  };

  return (
    <main className="flex flex-col items-center space-y-4 p-4">
      <p className="text-lg font-bold mb-4">Flash Card Game</p>
      {startGame ? (
        <div className="flex flex-col items-center">
          <p className="text-xl mb-2">
            Score: {score}/{count}
          </p>
          <p className="text-xl mb-2">Time remaining: {gameTimer} seconds</p>
          <p className="text-3xl mb-4">
            {firstValue} {gameMode} {secondValue} =
          </p>
          <input
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="border p-2 rounded mb-2"
            placeholder="Enter your answer"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
            onClick={() => generateNewQuestion()}
          >
            Skip Question
          </button>
          <p>{gameMode === GameMode.Division ? "Use 2 decimal places" : ""}</p>
          {!justStarted && (
            <p
              className={`text-lg mt-2 ${
                isCorrect ? "text-green-500" : "text-red-500"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect!"}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-lg mb-4">Select a game mode:</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={() => handleStartGame(GameMode.Addition)}
          >
            Addition
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={() => handleStartGame(GameMode.Subtraction)}
          >
            Subtraction
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={() => handleStartGame(GameMode.Multiplication)}
          >
            Multiplication
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={() => handleStartGame(GameMode.Division)}
          >
            Division
          </button>
        </div>
      )}
    </main>
  );
}
