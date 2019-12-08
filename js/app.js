const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const loader = document.getElementById("loader");
const exam = document.getElementById("exam");
let currentAnswer = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestion = [];
let questions = [];
//////////////////////////////Fetch API local Storage
// fetch("./jsonData/questions.json")
//   .then(res => {
//     return res.json();
//   })
//   .then(loadedQuestions => {
//     console.log(loadedQuestions);
//     questions = loadedQuestions;
//     startExam();
//   })
//   .catch(err => {
//     console.error(err);
//   });
////////////////////////////////////////////////////////////
fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });
    exam.classList.remove("d-none");
    loader.classList.add("d-none");
    startExam();
  })
  .catch(err => {
    console.error(err);
  });
////////////////////////////////////////////////////////////
//CONSTANTS
const CORRECT_BONUS = 10;
//TOTAL QUESTIONS AVAILABLE TO THE USER
const MAX_QUESTIONS = 3;
/////////////////////////////////////
startExam = () => {
  questionCounter = 0;
  score = 0;
  //... to have another copy and not affecting initial questions list
  availableQuestion = [...questions];
  getNewQuestion();
};
getNewQuestion = () => {
  if (availableQuestion.length == 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("./end.html");
  }
  questionCounter++;
  questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS;
  const questionIndex = Math.floor(Math.random() * availableQuestion.length);
  currentQuestion = availableQuestion[questionIndex];
  question.innerText = currentQuestion.question;
  choices.forEach(choice => {
    const number = choice.dataset["number"];
    console.log("|" + number);
    choice.innerText = currentQuestion["choice" + number];
    availableQuestion.splice(questionIndex, 1);
    acceptingAnswer = true;
  });
};
choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswer) {
      return;
    }
    acceptingAnswer = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    var classToApply = "incorrect";
    console.log(selectedAnswer + "|" + currentQuestion.answer);
    if (selectedAnswer == currentQuestion.answer) {
      score += 10;
      console.log(selectedAnswer + "|" + currentQuestion.answer);
      classToApply = "correct";
    }
    selectedChoice.parentElement.classList.add(classToApply);
    scoreText.innerText = score;
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

// getNextQuestion = () => {

//   getNewQuestion();
// };
