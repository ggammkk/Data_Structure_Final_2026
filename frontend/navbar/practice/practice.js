let currentProblem = null; // store the currently loaded problem
let editor; // monaco editor instance

// monaco editor setup (VS Code's open-source editor)
require.config({
    paths: { vs: "https://unpkg.com/monaco-editor@latest/min/vs" }
})
// make the editor with cpp lang, dark theme
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
    // load practice problems
    loadPracticeData();
});
// auto focus editor when mouse enters
document.getElementById("editor").addEventListener("mouseenter", () => {
    editor.focus();
});

// fetch practice topics data from backend
function loadPracticeData() {
    fetch("http://localhost:3000/api/practice-topics")
        .then(res => {
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            return res.json();
        })
        .then(topics => {
            loadTopics(topics); 
            // get topic from url query param or default to first topic, then load problem
            const params = new URLSearchParams(window.location.search);
            const topic = params.get("topic") || topics[0];
            loadProblem(topic);
            highlightActiveTopic(topic);
        })
        .catch(err => {
            setOutput("❌ Could not reach server.\n" + err.message, "error");
        });
}

// load sidebar topic links
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

// highlight active topic in sidebar
function highlightActiveTopic(activeTopic) {
    document.querySelectorAll(".topic-link").forEach(link => {
        const isActive = link.dataset.topic === activeTopic;
        link.classList.toggle("active-topic", isActive);
    });
}

// fetch problems data for selected topic and render
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
            // stores the first problem into currentProblem then render it
            currentProblem = data[0];
            renderProblem(currentProblem);
        })
        .catch(err => {
            setOutput("❌ Failed to load problem.\n" + err.message, "error");
        });
}

// give starter code template for problems
function cleanStarterCode(code) {
    return `#include <iostream>
using namespace std;

int main() {
    // Write your code here

    return 0;
}`;
}

// function to render problem (title, difficulty, category, problem statement, example input/output, and explanation steps)
function renderProblem(problem) {
    // title
    document.getElementById("problemTitle").innerText = problem.title;

    // difficulty badge and category badge
    const diffEl = document.getElementById("difficultyBadge");
    diffEl.innerText = problem.difficulty;
    diffEl.className = "";
    diffEl.classList.add(problem.difficulty?.toLowerCase());
    document.getElementById("categoryBadge").innerText = problem.category;

    // problem question, example input/output
    document.getElementById("problemText").innerText = problem.problem;
    document.getElementById("exampleInput").innerText = problem.example_input;
    document.getElementById("expectedOutput").innerText = problem.expected_output;

    setOutput("", "");
    
    // load starter code into editor
    editor.setValue(cleanStarterCode(problem.starter_code));

    // explanation
    document.getElementById("explanationList").innerHTML =
        (problem.explanation || [])
            .map(step => `<li>${step}</li>`)
            .join("");
}

// update the output box
function setOutput(text, type = "") {
    const box = document.getElementById("outputBox");
    box.innerText = text;
    box.className = "";   // remove all state classes
    if (type) box.classList.add(type);
}

// run code function, sends editor code to backend and displays output or errors
async function runExample() {
    const runBtn = document.querySelector(".btn-run");

    // show loading state
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

        // detect runtime errors vs normal output
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
        // restore button
        if (runBtn) {
            runBtn.classList.remove("loading");
            runBtn.innerHTML = `▶ Run Code`;
        }
    }
}


// show hint button, loads hint into editor
function showHint() {
    if (!currentProblem) return;
    setOutput("💡 Hint:\n\n" + (currentProblem.hint || "No hint available."), "hint");
}

// show solution button, loads solution into editor
function showSolution() {
    if (!currentProblem) {
        setOutput("No problem loaded yet.", "error");
        return;
    }

    editor.setValue(currentProblem.solution || "// No solution available.");
    setOutput("Solution loaded into editor.", "success");
}

// reset code button, restores starter code
function resetCode() {
    if (!currentProblem) return;
    editor.setValue(cleanStarterCode(currentProblem.starter_code));
    setOutput("Starter code restored.", "hint");
}
