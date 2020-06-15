const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const restart = document.getElementById("restart-btn");
const reset = document.getElementById("reset-btn");
var score = 0;
var gameOver = false;
let canAnswerQ = true;
let shuffledQuestions, currentQuestionIndex;
let highScores = localStorage.getItem("scores");
if (highScores) {
  highScores = JSON.parse(highScores);
} else {
  highScores = [];
}
restart.addEventListener("click", startGame);
startButton.addEventListener("click", startGame)
reset.addEventListener("click", function() {
  highScores = [];
  localStorage.removeItem('scores');
  questionContainerElement.innerText = "HighScores";
});

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
})

function startGame() {
  questionContainerElement.innerHTML = "";
  questionContainerElement.appendChild(questionElement);
  questionContainerElement.appendChild(answerButtonsElement);
  clearInterval(timerInterval);
  secondsLeft = 70;
  timeEl.textContent = secondsLeft;
  setTime();
  timeEl.classList.remove("hide");
  canAnswerQ = true;
  currentQuestionIndex = 0;
  gameOver = false;
  score = 0;
  restart.classList.add("hide");
  reset.classList.add("hide");

  startButton.classList.add("hide");
  shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  setNextQuestion();
}

var timeEl = document.querySelector(".time")
var secondsLeft = 70;
var timerInterval;
function setTime() {
  timerInterval = setInterval(function() {
    secondsLeft--;
    timeEl.textContent = secondsLeft;

    if(secondsLeft === 0 && !gameOver) {
      clearInterval(timerInterval);
      sendMessage();
      nextButton.classList.add("hide");
    }

  }, 1000);
}


function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
  canAnswerQ = true;
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.classList.add("btn");
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  })
};

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hide");
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  if (!canAnswerQ) {
    return 
  }
  canAnswerQ = false;
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  if (correct) {
    score++;
    questionElement.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style=color:green>Correct!</b>";
  } else {
    secondsLeft -= 5;
    questionElement.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style=color:red>Wrong!</b>";
  }
  setStatusClass(document.body, correct);
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct);
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");

  } else {
    // startButton.innerText = "Restart";
    // startButton.classList.remove("hide");
    sendMessage();
  }
  // nextButton.classList.remove("hide");
};

function sendMessage() {
  clearStatusClass(document.body);
  gameOver = true;
  timeEl.classList.add("hide");
  questionContainerElement.innerHTML = "<b>You're all done!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your score: " + score + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Enter your initials here: </b>";

  var initials = document.createElement("INPUT");
  initials.setAttribute("type", "text");
  questionContainerElement.appendChild(initials);
  var submitButton = document.createElement("INPUT");
  submitButton.setAttribute("type", "submit");
  questionContainerElement.appendChild(submitButton);
  submitButton.addEventListener("click", function(event) {

    event.preventDefault();
    const nameScorePair = {
      name: initials.value,
      score: score
    };
    highScores.push(nameScorePair);
    highScores.sort(function(a, b) {
      return b.score - a.score;
    });
    localStorage.setItem("scores", JSON.stringify(highScores));
    questionContainerElement.innerText = "HighScores";
    highScores.forEach(function(pair) {
      var entry = document.createElement("p");
      entry.textContent = pair.score + " " + pair.name;
      questionContainerElement.appendChild(entry);
    })
    restart.classList.remove("hide");
    reset.classList.remove("hide");
  });
  

}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
};

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
};

const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "Hyper Text Markup Language", correct: true},
      { text: "Home Tool Markup Language", correct: false},
      { text: "Hyper Tool Markup Language", correct: false},
      { text: "Hyperlinks and Text Markup Language", correct: false}
    ]
  },
  {
    question: "Who is making the Web standards?",
    answers: [
      { text: "Mozilla", correct: false},
      { text: "Hhe World Wide Web Consortium", correct: true},
      { text: "Google", correct: false},
      { text: "Mozilla", correct: false}
    ]
  },
  {
    question: "Choose the correct HTML element for the largest heading:",
    answers: [
      { text: "<head>", correct: false},
      { text: "<h1>", correct: true},
      { text: "<h6>", correct: false},
      { text: "<header>", correct: false}
    ]
  },
  {
    question: "What does CSS stand for?",
    answers: [
      { text: "Colorful Style Sheets", correct: false},
      { text: "Creative Style Sheets", correct: false},
      { text: "Computer Style Sheets", correct: false},
      { text: "Cascading Style Sheets", correct: true}
    ]
  },
  {
    question: "Where in an HTML document is the correct place to refer to an external style sheet?",
    answers: [
      { text: "At the end of the document", correct: false},
      { text: "In the <body> section", correct: false},
      { text: "In the <header> section", correct: false},
      { text: "In the <head> section", correct: true}
    ]
  },
  {
    question: "Where is the correct place to insert a JavaScript?",
    answers: [
      { text: "The <body> section", correct: false},
      { text: "Both the <head> section and the <body> section are correct", correct: true},
      { text: "In the <header> section", correct: false},
      { text: "The <head> section", correct: false}
    ]
  },
  {
    question: "The Bootstrap grid system is based on how many columns?",
    answers: [
      { text: "3", correct: false},
      { text: "12", correct: true},
      { text: "6", correct: false},
      { text: "9", correct: false}
    ]
  }
]