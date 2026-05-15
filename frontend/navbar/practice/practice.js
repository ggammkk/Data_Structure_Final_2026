let currentProblem = null;

fetch("http://localhost:3000/api/practice-topics")
    .then(res => res.json())
    .then(topics => {
        loadTopics(topics);

        const params = new URLSearchParams(window.location.search);
        const topic = params.get("topic") || topics[0];

        loadProblem(topic);
    });

function loadTopics(topics) {
    const topicList = document.getElementById("topicList");

    topicList.innerHTML = topics.map(topic => `
        <a class="topic-link" href="practice.html?topic=${encodeURIComponent(topic)}">
            ${topic}
        </a>
    `).join("");
}

function loadProblem(topic) {
    fetch(`http://localhost:3000/api/practice/${encodeURIComponent(topic)}`)
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                document.getElementById("problemTitle").innerText =
                    "No problem found";
                return;
            }

            currentProblem = data[0];
            renderProblem(currentProblem);
        });
}

function renderProblem(problem) {
    document.getElementById("problemTitle").innerText = problem.title;
    document.getElementById("difficultyBadge").innerText = problem.difficulty;
    document.getElementById("categoryBadge").innerText = problem.category;
    document.getElementById("problemText").innerText = problem.problem;
    document.getElementById("exampleInput").innerText = problem.example_input;
    document.getElementById("expectedOutput").innerText = problem.expected_output;
    document.getElementById("codeEditor").value = problem.starter_code;
    document.getElementById("outputBox").innerText = "";

    document.getElementById("explanationList").innerHTML =
        problem.explanation.map(step => `<li>${step}</li>`).join("");
}

function runExample() {
    document.getElementById("outputBox").innerText =
        "Expected Output:\n" + currentProblem.expected_output;
}

function showHint() {
    document.getElementById("outputBox").innerText =
        "Hint:\n" + currentProblem.hint;
}

function showSolution() {
    document.getElementById("codeEditor").value =
        currentProblem.solution;

    document.getElementById("outputBox").innerText =
        "Solution loaded into editor.";
}

function resetCode() {
    document.getElementById("codeEditor").value =
        currentProblem.starter_code;

    document.getElementById("outputBox").innerText =
        "Starter code restored.";
}