// click listener for interview page
document.addEventListener("DOMContentLoaded", () => {
    const refreshBtn = document.getElementById("refreshBtn");
    // refresh questions when button is clicked 
    refreshBtn.addEventListener("click", () => {
        console.log("New Random Questions clicked");
        loadInterviewQuestions(); // load new questions
    });
    // load questions when page loads
    loadInterviewQuestions();
});

// fetch randomized interview questions from backend and render
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

// render questions function, creates question cards with show answer toggle
function renderQuestions(questions) {
    const container = document.getElementById("questionContainer");
    // create a card for each question (with title, difficulty badge, category badge, question text, and show answer button)
    container.innerHTML = questions.map((q, index) => `
        <div class="question-card">
            <div class="question-top">
                <h2>Question ${index + 1}</h2>
                <div class="badges">
                    <span class="difficulty ${q.difficulty?.toLowerCase()}">${q.difficulty}</span>
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

// toggle answer box visibility
function toggleAnswer(index) {
    const box = document.getElementById(`answer-${index}`);

    if (box.style.display === "none" || box.style.display === "") {
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}