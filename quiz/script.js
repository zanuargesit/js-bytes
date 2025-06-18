const questions = [
    {
        question: "What is the maximum file upload size?",
        answers: [
            { text: "No more than 2GB", correct: true },
            { text: "No more than 1GB", correct: false },
            { text: "No more than 5GB", correct: false },
            { text: "No more than 10GB", correct: false }
        ]
    },
    {
        question: "How do I reset my password?",
        answers: [
            { text: "Via email reset link", correct: true },
            { text: "By calling customer service", correct: false },
            { text: "Through social media", correct: false },
            { text: "It's not possible to reset", correct: false }
        ]
    },
    {
        question: "Can I cancel my subscription?",
        answers: [
            { text: "Yes, anytime with no questions asked", correct: true },
            { text: "Only within 7 days of signing up", correct: false },
            { text: "Yes, but with a cancellation fee", correct: false },
            { text: "No, subscriptions are permanent", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons"); 
const nextButton = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-btn");

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.style.display = "none";
    resultContainer.style.display = "none";
    questionContainer.style.display = "block";
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add("answer-btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    
    if (isCorrect) {
        score++;
        selectedButton.style.backgroundColor = "#9aeabc"; 
    } else {
        selectedButton.style.backgroundColor = "#ff9393"; 
    }
    
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
        if (button.dataset.correct === "true") {
            button.style.backgroundColor = "#9aeabc"; 
        }
    });
    
    if (currentQuestionIndex < questions.length - 1) {
        nextButton.style.display = "inline-block";
    } else {
        setTimeout(showResult, 1000);
    }
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    showQuestion();
});

function showResult() {
    questionContainer.style.display = "none";
    resultContainer.style.display = "block";
    scoreElement.textContent = `Score: ${score} out of ${questions.length}`;
}

restartButton.addEventListener("click", startQuiz);

startQuiz();