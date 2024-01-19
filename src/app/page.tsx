"use client";

import { useState } from "react";

export default function Home() {
  const [firstValue, setFirstValue] = useState(1);
  const [secondValue, setSecondValue] = useState(2);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [justStarted, setJustStarted] = useState(true);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [startGame, setStartGame] = useState(false);
  const maximumNumber = 12

  // Create a 2D array to keep track of which values have been used
  const valueTrackerTemp: boolean[][] = [];
  for (var i = 0; i <= maximumNumber; i++) {
    valueTrackerTemp.push([]);
    for (var j = 0; j <= maximumNumber; j++) {
      valueTrackerTemp[i].push(false);
    }
  }
  const [valueTracker, setValueTracker] = useState(valueTrackerTemp);

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  const handleStartGame = () => {
    generateNewQuestion();
    setStartGame(true);
  }
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
    if (count >= (maximumNumber + 1) * (maximumNumber + 1)) {
      alert(`You've finished all the questions! You scored ${score}/${count}`);
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
  }
  ;

  return (
    <main>
      {startGame ? (
      <div>
      <p>Score: {score}/{count}</p>
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
