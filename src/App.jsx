import { useState } from "react";
import "./App.css";
import React from "react";
import TextRevealProfile from "./TextRevealProfile";

// Fisher-Yates Shuffle
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function App() {
  const vocabList = [
    {
      word: "걱정",
      synonym: "apprehension",
      hint: "Test day can be a time of great ____ for many students.",
    },
    {
      word: "민첩함",
      synonym: "celerity",
      hint: "The ____ with which the police responded to the bank robbery prevented the thieves from escaping.",
    },

    {
      word: "꾀병을 부리다",
      synonym: "malinger",
      hint: "The soldier ____ in order to avoid combat.",
    },
    {
      word: "통찰",
      synonym: "epiphany",
      hint: "The scientist had an ____ that led to a major breakthrough in his research.",
    },
    {
      word: "익숙하게 하다",
      synonym: "inure",
      hint: "The soldiers were ____ to the hardships of war.",
    },
    {
      word: "방해하다",
      synonym: "stymie",
      hint:"The company's growth was ____ by a sluggish economy.",
    },
    {
      word: "찢을정도로 비난하다",
      synonym: "lacerate",
      hint: "The ____ wound required several stitches.",
    },
    {
      word: "해결",
      synonym: "denouement",
      hint:"The ____ of the movie was unexpected.",
    },
    {
      word: "은밀한",
      synonym: "surreptitious",
      hint: "The ____ spy was able to steal the plans without being noticed.",
    },
    {
      word: "강력한",
      synonym: "puissant",
      hint: "The ____ king was able to defeat all of his enemies.",
    },
    {
      word: "아첨하다",
      synonym: "fawn",
      hint: "The dog ____ over its owner.",
    },
    {
      word: "당황하게 하다",
      synonym: "discomfit",
      hint: "The politician was ____ by the reporter's questions.",
    },
    {
      word: "궁핍한",
      synonym: "indigent",
      hint: "The ____ family could not afford to buy food",
    },
    {
      word: "변화무쌍한",
      synonym: "protean",
      hint: "The ____ actor could play any role",
    },
    {
      word: "망상",
      synonym: "chimera",
      hint: "The idea that I would one day be a famous movie star was merely a ____.",
    },
    {
      word: "빈약한",
      synonym: "anemic",
      hint: "The ____ sales of the company's newest product were a disappointment.",
    },
    {
      word: "음모를 꾸미다",
      synonym: "machinate",
      hint: "The evil villain ____ a plan to take over the world.",
    },
  ];
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [wronglyAnswered, setWronglyAnswered] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [onStreak, setOnStreak] = useState(false);
  const shuffledVocabList = shuffle([...vocabList]);
  const [scoreList, setScoreList] = useState([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [shuffledWrongAnswers, setShuffledWrongAnswers] = useState([]);
  const [remainingQuestions, setRemainingQuestions] = useState(
    vocabList.map((_, idx) => idx)
  );

  React.useEffect(() => {
    const savedScores = localStorage.getItem("scoreList");
    if (savedScores) {
      const sortedScores = JSON.parse(savedScores).sort(
        (a, b) => b.score - a.score
      );
      setScoreList(sortedScores);
    }
  }, []);


  const checkAnswer = () => {
    const isCorrect = inputValue === vocabList[index].synonym;
    const pointValue = 1; // Points for a correct answer

    if (isCorrect) {
      setStreak((prevStreak) => prevStreak + 1);
      setShowCorrectAnswer(false);
      setRemainingQuestions((prev) => prev.filter((i) => i !== index));
      // Check if user has a streak of 3 or more
      if (streak >= 2) {
        setOnStreak(true);
        setScore((prevScore) => prevScore + 3 * pointValue);
      } else {
        setScore((prevScore) => prevScore + pointValue);
      }

      setCorrectCount((prevCount) => prevCount + 1);

      // If answered correctly, remove from wronglyAnswered and shuffledWrongAnswers
      if (wronglyAnswered.includes(index)) {
        setWronglyAnswered((prev) => prev.filter((idx) => idx !== index));
        setShuffledWrongAnswers((prev) => prev.filter((idx) => idx !== index));
      }

      // Immediately proceed to the next question if the answer is correct
      moveToNextQuestion();
    } else {
      setStreak(0); // Reset the streak
      setOnStreak(false);
      setShowCorrectAnswer(true);
      if (!wronglyAnswered.includes(index)) {
        setWronglyAnswered((prev) => [...prev, index]);
      }
      setWrongCount((prevCount) => prevCount + 1);

      // Wait for 3 seconds before moving to the next question after a wrong answer
      setTimeout(() => {
        setShowCorrectAnswer(false);
        moveToNextQuestion();
      }, 3000);
    }
  };

  const moveToNextQuestion = () => {
    let newIndex;

    if (wronglyAnswered.includes(index) && shuffledWrongAnswers.length > 0) {
      const currPosition = shuffledWrongAnswers.indexOf(index);
      newIndex = shuffledWrongAnswers[currPosition + 1];
    } else if (remainingQuestions.length > 0) {
      // This ensures a random question is picked from the remaining questions
      newIndex =
        remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
    } else {
      newIndex = undefined; // All questions have been answered
    }

    // If there's no new question (i.e., all questions have been answered correctly),
    // handle accordingly. For now, we're just resetting to the first question,
    // but you might want a more refined approach.
    if (newIndex === undefined) {
      newIndex = 0; // Or some logic to end the quiz.
    }

    setIndex(newIndex);
    setInputValue("");
  };

  const clearScores = () => {
    localStorage.removeItem("scoreList");
    setScoreList([]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkAnswer();
    }
  };

  const totalWords = vocabList.length;
  const correctWidth = (correctCount / totalWords) * 100;
  const wrongWidth = (wrongCount / totalWords) * 100;

  const handleFinish = () => {
    const shouldRecord = window.confirm("Do you want to record your score?");
    if (shouldRecord) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}-${currentDate.getHours()}:${currentDate.getMinutes()}${currentDate.getHours() >= 12 ? "pm" : "am"}`;
      const newScore = { score, timestamp: formattedDate };

      const newScoreList = [...scoreList, newScore];
      setScoreList(newScoreList);
      localStorage.setItem("scoreList", JSON.stringify(newScoreList));
    }
  };

  return (
    <>
      <TextRevealProfile />

      <div className="vocab-section">
        {remainingQuestions.length === 1 && (
          <h2 style={{ textAlign: "center" }}>Last Question</h2>
        )}
        <h3>Intermed-05/02</h3>
        <p>Meaning: {vocabList[index].word}</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter the synonym"
          />
          <button onClick={checkAnswer}>Check</button>
          <button onClick={() => setShowHint(!showHint)}>Hint</button>
          <button
            onClick={handleFinish}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            Finish
          </button>

          <button
            onClick={clearScores}
            style={{ position: "absolute", top: "10px", right: "120px" }}
          >
            Clear Scores
          </button>

          <div style={{ position: "absolute", top: "40px", right: "10px" }}>
            {scoreList.map((s, index) => (
              <div key={index}>
                Score: {s.score}{" "}
                <span
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.9em",
                    color: "grey",
                  }}
                >
                  {s.timestamp}
                </span>
              </div>
            ))}
          </div>
        </form>

        <div className={`score ${onStreak ? "glow" : ""}`}>Score: {score}</div>

        {/* Show the correct answer when the answer is wrong */}
        <div className={`correct-answer ${showCorrectAnswer ? "fade-in" : ""}`}>
          Correct Answer: {vocabList[index].synonym}
        </div>

        <div className={`hint ${showHint ? "show" : ""}`}>
          {vocabList[index].hint}
        </div>
      </div>
      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress correct"
            style={{ width: `${correctWidth}%` }}
          ></div>
        </div>
        <div className="progress-bar">
          <div
            className="progress wrong"
            style={{ width: `${wrongWidth}%` }}
          ></div>
        </div>
      </div>
    </>
  );
              };

export default App;
