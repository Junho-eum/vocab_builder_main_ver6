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
      word: "독창성",
      synonym: "ingenuity",
      hint: "The ____ of the software developers is evident in the latest version of the app.",
    },
    {
      word: "잘 어울리는",
      synonym: "becoming",
      hint: "The dress was ____ on her.",
    },

    {
      word: "다부서져가는",
      synonym: "dilapidated",
      hint: "The house was in a ____ condition.",
    },
    {
      word: "변형시키다",
      synonym: "transmute",
      hint: "The alchemist believed that he could ____ lead into gold.",
    },
    {
      word: "신속함",
      synonym: "dispatch",
      hint: "She finished her thesis with ____, still managing to produce a well-written paper despite the time crunch.",
    },
    {
      word: "지혜로운",
      synonym: "sagacious",
      hint: "Steve Jobs is surely one of the most ____ CEOs of our time.",
    },
    {
      word: "자만심 있는",
      synonym: "smug",
      hint: "The ____ look on his face told me that he was very pleased with himself.",
    },
    {
      word: "비통한",
      synonym: "dolorous",
      hint: "The ____ look on her face told me that she was still grieving for her lost husband.",
    },
    {
      word: "걱정",
      synonym: "solicitude",
      hint: "The mother's ____ for her children was evident in her constant worrying about their safety.",
    },
    {
      word: "취소하다",
      synonym: "countermand",
      hint: "The general ____ the order to retreat.",
    },
    {
      word: "냉소적인",
      synonym: "sardonic",
      hint: "The ____ tone of his voice made it clear that he was not joking.",
    },
    {
      word: "(특히 남성용) 의류의, 재봉[재단]의",
      synonym: "sartorial",
      hint: "The ____ style of the suit was very fashionable",
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
      hint: "The idea that I would one day be a famous movie star was merely a chimera.",
    },
    {
      word: "빈약한",
      synonym: "anemic",
      hint: "The anemic sales of the company's newest product were a disappointment.",
    },
    {
      word: "화나게 하다",
      synonym: "exasperate",
      hint: "The child's constant whining exasperated his mother.",
    },
    {
      word: "귀찮게[짜증나게] 하다 ",
      synonym: "rile",
      hint: "The loud music ____ed the neighbors",
    },
    {
      word: "굽실거리다",
      synonym: "kowtow",
      hint: "The servant ____ed to the king",
    },
    {
      word: "복잡한 시국, 난국",
      synonym: "imbroglio",
      hint: "The ____ was caused by the president's poor leadership",
    },
    {
      word: "용납하지 않다",
      synonym: "brook",
      hint: "The teacher did not ____ cheating",
    },
    {
      word: "(재산·권력 등에 대한) 탐욕",
      synonym: "cupidity",
      hint: "The businessman's ____ led him to commit fraud",
    },
    {
      word: "겉치장, 허식",
      synonym: "veneer",
      hint: "The politician's ____ of honesty was not convincing",
    },
    {
      word: "존재하다 (=apply)",
      synonym: "obtain",
      hint: "The rule ____s to all students",
    },
    {
      word: "(비밀을) 알려주다[누설하다]",
      synonym: "divulge",
      hint: "The spy ____ed the secret information",
    },
    {
      word: "(책이나 기록에서 부적당한 부분을) 삭제하다",
      synonym: "expurgate",
      hint: "The book was ____ed because it contained inappropriate content",
    },
    {
      word: " 용기[결단력] 있는 (=brave)",
      synonym: "plucky",
      hint: "The ____ soldier was not afraid of the enemy",
    },
    {
      word: "(느낌·경험이) 대리의[간접적인]",
      synonym: "vicarious",
      hint: "The student lived ____ly through his favorite character in the book",
    },
    {
      word: "어리석음, 우둔",
      synonym: "inanity",
      hint: "The ____ of the student made him fail the test",
    },
    {
      word: "(너무 오래되어) 재미없는, 시들한",
      synonym: "hoary",
      hint: "The ____ joke was not funny",
    },
    {
      word: "의문을 제기하다 (=challenge)",
      synonym: "impugn",
      hint: "The lawyer ____ed the witness's testimony",
    },
    {
      word: "(곤경·불쾌한 일의) 일시적인 중단, 한숨 돌리기",
      synonym: "respite",
      hint: "The vacation was a welcome ____ from work",
    },
    {
      word: "아첨꾼, 알랑쇠",
      synonym: "sycophant",
      hint: "The ____ was always trying to please his boss",
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
