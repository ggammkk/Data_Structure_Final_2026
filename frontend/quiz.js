let questions = [];
let currentQuestion = 0;
let score = 0;

function loadQuiz(topic = "Data") {
    fetch(`http://localhost:3000/api/quiz/${encodeURIComponent(topic)}`)
        .then(response => response.json())
        .then(data => {
            questions = data;
            currentQuestion = 0;
            score = 0;

            showQuestion();
        })
        .catch(error => {
            console.log("Quiz error:", error);
            document.getElementById("quizBox").innerHTML =
                "<p>Failed to load quiz. Make sure backend is running.</p>";
        });
}

function showQuestion() {
    const quizBox = document.getElementById("quizBox");

    if (currentQuestion >= questions.length) {
        quizBox.innerHTML = `
            <h2>Quiz Complete!</h2>
            <p>Your score: ${score}/${questions.length}</p>
            <button onclick="loadQuiz('Data')">Restart Quiz</button>
        `;
        return;
    }

    const q = questions[currentQuestion];

    quizBox.innerHTML = `
    <div class="question-card">
        <h2>Question ${currentQuestion + 1}</h2>
        <p>${q.question}</p>

        ${q.image ? `<img src="../${q.image}" class="quiz-image" alt="Quiz image">` : ""}

        ${q.code ? `<pre class="code-block">${q.code}</pre>` : ""}

        <div class="options">
            ${q.options.map(option => `
                <button onclick="checkAnswer('${escapeText(option)}')">
                    ${option}
                </button>
            `).join("")}
        </div>

        <p>Score: ${score}</p>
    </div>
`;
}

function checkAnswer(selected) {
    const correct = questions[currentQuestion].answer;

    if (selected === correct) {
        score++;
        alert("Correct!");
    } else {
        alert(`Wrong. Correct answer: ${correct}`);
    }

    currentQuestion++;
    showQuestion();
}

function escapeText(text) {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

/*window.onload = function () {
    loadQuiz("Data");
};*/

function loadTopics() {
    fetch("http://localhost:3000/api/quiz-topics")
        .then(response => response.json())
        .then(topics => {
            const select = document.getElementById("topicSelect");
            select.innerHTML = "";

            topics.forEach(topic => {
                const option = document.createElement("option");
                option.value = topic;
                option.textContent = topic;
                select.appendChild(option);
            });

            if (topics.length > 0) {
                loadQuiz(topics[0]);
            }
        })
        .catch(error => {
            console.log("Topic load error:", error);
        });
}

window.onload = function () {
    loadTopics();
};