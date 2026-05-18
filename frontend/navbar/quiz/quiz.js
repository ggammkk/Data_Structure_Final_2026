let currentTopic = ""; // store the currently selected quiz topic
let score = 0; // track quiz score

// auto indent code for code snippets
function formatCppCode(code) {
    let indent = 0;
    return code.split("\n").map(line => {
        line = line.trim();
        if (line.startsWith("}")) indent--;
        const result = "\t".repeat(Math.max(0, indent)) + line;
        if (line.endsWith("{")) indent++;
        return result;
    }).join("\n");
}

// fetch quiz topics from backend then pass them to loadsidebar function
fetch("http://localhost:3000/api/quiz-topics")
  .then(res => res.json())
  .then(topics => {
    loadSidebar(topics);

    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic") || topics[0];

    loadQuiz(topic);
  });

// load sidebar
function loadSidebar(topics) {
  const sidebar = document.getElementById("sidebarTopics"); // get sidebar content element 
  // turn each topic into a link that goes to other quiz page
  sidebar.innerHTML = topics.map(topic => `
    <a
      href="?topic=${encodeURIComponent(topic)}"
      class="sidebar-link"
    >
      ${topic}
    </a>
  `).join("");
}

// load quiz questions for selected topic
function loadQuiz(topic) {
  currentTopic = topic;
  score = 0; // reset score to 0 when goes to other page
  // fetch quiz questions for topic and render
  fetch(`http://localhost:3000/api/quiz/${encodeURIComponent(topic)}`)
    .then(res => res.json())
    .then(questions => {
      document.getElementById("quizTitle").innerText = topic + " Quiz";
      document.getElementById("scoreBoard").innerText = `Score: ${score}`;

      renderQuestions(questions);
      highlightActiveTopic();
    });
}

// render quiz questions, creates question blocks with options and handles answer selection function
function renderQuestions(questions) {
  const quizBox = document.getElementById("quizBox");
  quizBox.innerHTML = "";

  questions.forEach((q, index) => {
    const block = document.createElement("div"); // create a block for each question
    block.className = "question-block";

    const shuffledOptions = [...q.options] // shuffle questions
      .sort(() => Math.random() - 0.5);
    // the inside of the block
    block.innerHTML = `
      <h2>Question ${index + 1}</h2>
      <p>${q.question}</p>

      ${q.image ? `<img src="../../../${q.image}" class="quiz-image">` : ""}

      ${q.code ? `<pre class="code-block" data-code="${encodeURIComponent(q.code)}"></pre>` : ""}

      <div class="options">
        ${shuffledOptions.map(option => `
          <button class="option-btn">${option}</button>
        `).join("")}
      </div>

      <p class="answer-text"></p>
    `;

    quizBox.appendChild(block);

    block.querySelectorAll(".code-block[data-code]").forEach(pre => {
        pre.textContent = formatCppCode(decodeURIComponent(pre.dataset.code));
    });

    const buttons = block.querySelectorAll(".option-btn");
    // add click event listener to each option button
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (block.dataset.answered) return;

        block.dataset.answered = true;

        const correct = q.answer;
        const selected = btn.innerText;

        if (selected === correct) {
          btn.classList.add("correct");
          score++;

          block.querySelector(".answer-text").innerText =
            q.explanation || `Correct Answer: ${correct}`;
        } else {
          btn.classList.add("wrong");

          buttons.forEach(b => {
            if (b.innerText === correct) {
              b.classList.add("correct");
            }
          });
          // add explanation for wrong answer
          block.querySelector(".answer-text").innerText =
            q.wrong_explanations?.[selected] || 
            `Correct Answer: ${correct}`;
        }

        document.getElementById("scoreBoard").innerText = `Score: ${score}`;
      });
    });
  });
}

// highlight the active topic
function highlightActiveTopic() {
  document.querySelectorAll(".sidebar-link").forEach(link => { // go thru each topic link
    link.classList.remove("active-topic");

    const topic = new URL(link.href).searchParams.get("topic");

    if (topic === currentTopic) {
      link.classList.add("active-topic");
    }
  });
}