document.addEventListener('DOMContentLoaded', () => {
    const loadingElement = document.getElementById("loading");
    const errorElement = document.getElementById("error");
    const quizContainer = document.getElementById("quiz-container");
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const submitButton = document.getElementById("submit-btn");
    const nextButton = document.getElementById("next-btn");
    const resultsElement = document.getElementById("results");
    const scoreElement = document.getElementById("score");
    const restartButton = document.getElementById("restart-btn");

    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];

    const decodeHtml = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    const fetchQuestions = async (amount = 5) => {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple');
            const data = await response.json();
            questions = data.results;
            startQuiz();
        } catch (error) {
            showError('Failed to load questions. Please try again later.');
        }
    };

    const startQuiz = () => {
        loadingElement.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        showQuestion();
    };

    const showQuestion = () => {
        const question = questions[currentQuestionIndex];
        questionElement.innerHTML = decodeHtml(question.question);
        answersElement.innerHTML = '';

        const answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
        answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerHTML = decodeHtml(answer);
            button.classList.add('answer-btn');
            button.addEventListener('click', () => handleAnswerSubmission(answer));
            answersElement.appendChild(button);
        });
    };

    const handleAnswerSubmission = (selectedAnswer) => {
        const question = questions[currentQuestionIndex];
        if (selectedAnswer === question.correct_answer) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    };

      const showResults = () => {
        quizContainer.classList.add('hidden');
        resultsElement.classList.remove('hidden');
        scoreElement.innerHTML = `You scored ${score} out of ${questions.length}`; // Fixed line
    };
    

    const showError = (message) => {
        errorElement.innerHTML = message;
        errorElement.classList.remove('hidden');
    };

    submitButton.addEventListener('click', () => {
        handleAnswerSubmission(); // This might not be necessary if handling answers via button clicks
    });

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    });

    restartButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        resultsElement.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        fetchQuestions();
    });

    fetchQuestions();
});