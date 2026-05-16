let currentProblem = null;
let editor;

// =========================
// MONACO EDITOR
// =========================

require.config({
    paths: { vs: "https://unpkg.com/monaco-editor@latest/min/vs" }
});

require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById("editor"), {
        value: "",
        language: "cpp",
        theme: "vs-dark",
        automaticLayout: true,
        fontSize: 14,
        fontFamily: "'Space Mono', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        lineNumbersMinChars: 3,
    });

    loadPracticeData();
});


// =========================
// LOAD DATA
// =========================

function loadPracticeData() {
    fetch("http://localhost:3000/api/practice-topics")
        .then(res => {
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            return res.json();
        })
        .then(topics => {
            loadTopics(topics);
            const params = new URLSearchParams(window.location.search);
            const topic = params.get("topic") || topics[0];
            loadProblem(topic);
            highlightActiveTopic(topic);
        })
        .catch(err => {
            setOutput("❌ Could not reach server.\n" + err.message, "error");
        });
}


// =========================
// SIDEBAR TOPICS
// =========================

function loadTopics(topics) {
    const topicList = document.getElementById("topicList");
    topicList.innerHTML = topics.map(topic => `
        <a
            class="topic-link"
            href="practice.html?topic=${encodeURIComponent(topic)}"
            data-topic="${topic}"
        >${topic}</a>
    `).join("");
}

function highlightActiveTopic(activeTopic) {
    document.querySelectorAll(".topic-link").forEach(link => {
        const isActive = link.dataset.topic === activeTopic;
        link.classList.toggle("active-topic", isActive);
    });
}


// =========================
// LOAD PROBLEM
// =========================

function loadProblem(topic) {
    fetch(`http://localhost:3000/api/practice/${encodeURIComponent(topic)}`)
        .then(res => {
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                document.getElementById("problemTitle").innerText = "No problem found";
                return;
            }
            currentProblem = data[0];
            renderProblem(currentProblem);
        })
        .catch(err => {
            setOutput("❌ Failed to load problem.\n" + err.message, "error");
        });
}


// =========================
// RENDER PROBLEM
// =========================

function renderProblem(problem) {
    document.getElementById("problemTitle").innerText = problem.title;

    const diffEl = document.getElementById("difficultyBadge");
    diffEl.innerText = problem.difficulty;
    diffEl.className = "";  
    diffEl.classList.add(problem.difficulty?.toLowerCase());

    document.getElementById("categoryBadge").innerText = problem.category;
    document.getElementById("problemText").innerText = problem.problem;
    document.getElementById("exampleInput").innerText = problem.example_input;
    document.getElementById("expectedOutput").innerText = problem.expected_output;

    setOutput("", ""); 

    editor.setValue(problem.starter_code || "");

    document.getElementById("explanationList").innerHTML =
        (problem.explanation || [])
            .map(step => `<li>${step}</li>`)
            .join("");
}


// =========================
// OUTPUT HELPER
// =========================

function setOutput(text, type = "") {
    const box = document.getElementById("outputBox");
    box.innerText = text;
    box.className = "";   // remove all state classes
    if (type) box.classList.add(type);
}


// =========================
// RUN CODE  ← fixed
// =========================

// The HTML calls: onclick="runExample()"  (no event arg — that's fine now)
async function runExample() {
    const runBtn = document.querySelector(".btn-run");

    // Show loading state
    if (runBtn) {
        runBtn.classList.add("loading");
        runBtn.textContent = "Running…";
    }

    setOutput("Running…", "");

    try {
        const code = editor.getValue();

        const response = await fetch("http://localhost:3000/api/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        // Detect runtime errors vs normal output
        if (data.error) {
            setOutput(data.error, "error");
        } else {
            setOutput(data.output || "(no output)", "success");
        }

    } catch (err) {
        setOutput(
            "❌ Could not run code.\n\n" +
            "Make sure your local server is running at localhost:3000.\n\n" +
            "Error: " + err.message,
            "error"
        );
    } finally {
        // Restore button
        if (runBtn) {
            runBtn.classList.remove("loading");
            runBtn.innerHTML = `▶ Run Code`;
        }
    }
}


// =========================
// HINT
// =========================

function showHint() {
    if (!currentProblem) return;
    setOutput("💡 Hint:\n\n" + (currentProblem.hint || "No hint available."), "hint");
}


// =========================
// SOLUTION
// =========================

function showSolution() {
    if (!currentProblem) return;
    editor.setValue(currentProblem.solution || "// No solution available.");
    setOutput("Solution loaded into editor.", "success");
}


// =========================
// RESET
// =========================

function resetCode() {
    if (!currentProblem) return;
    editor.setValue(currentProblem.starter_code || "");
    setOutput("Starter code restored.", "hint");
}