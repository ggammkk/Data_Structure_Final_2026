document.addEventListener("DOMContentLoaded", () => {
    const refreshBtn = document.getElementById("refreshBtn");

    refreshBtn.addEventListener("click", () => {
        console.log("New Random Questions clicked");
        loadInterviewQuestions();
    });

    loadInterviewQuestions();
});

function loadInterviewQuestions() {

    fetch("http://localhost:3000/api/interview")

        .then(res => res.json())

        .then(data => {

            console.log("NEW QUESTIONS LOADED");
            console.log(data);

            renderQuestions(data.questions || data);
        })

        .catch(error => {

            console.log("Interview load error:", error);
        });
}

function renderQuestions(questions) {
    const container = document.getElementById("questionContainer");

    container.innerHTML = questions.map((q, index) => `
        <div class="question-card">
            <div class="question-top">
                <h2>Question ${index + 1}</h2>
                <div class="badges">
                    <span class="difficulty">${q.difficulty}</span>
                    <span class="category">${q.category}</span>
                </div>
            </div>

            <p class="question-text">${q.question}</p>

            <button type="button" onclick="toggleAnswer(${index})">
                Show Answer
            </button>

            <div class="answer-box" id="answer-${index}" style="display:none;">
                <h3>Answer</h3>
                <p>${q.answer}</p>

                <h3>Key Points</h3>
                <ul>
                    ${(q.key_points || []).map(point => `<li>${point}</li>`).join("")}
                </ul>
            </div>
        </div>
    `).join("");
}

function toggleAnswer(index) {
    const box = document.getElementById(`answer-${index}`);

    if (box.style.display === "none" || box.style.display === "") {
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}