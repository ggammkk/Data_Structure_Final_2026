let currentTopic = "";
let score = 0;

fetch("http://localhost:3000/api/quiz-topics")
  .then(res => res.json())
  .then(topics => {
    loadSidebar(topics);

    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic") || topics[0];

    loadQuiz(topic);
  });

function loadSidebar(topics) {
  const sidebar = document.getElementById("sidebarTopics");

  sidebar.innerHTML = topics.map(topic => `
    <a
      href="?topic=${encodeURIComponent(topic)}"
      class="sidebar-link"
    >
      ${topic}
    </a>
  `).join("");
}

function loadQuiz(topic) {
  currentTopic = topic;
  score = 0;

  fetch(`http://localhost:3000/api/quiz/${encodeURIComponent(topic)}`)
    .then(res => res.json())
    .then(questions => {
      document.getElementById("quizTitle").innerText = topic + " Quiz";
      document.getElementById("scoreBoard").innerText = `Score: ${score}`;

      renderQuestions(questions);
      highlightActiveTopic();
    });
}

function renderQuestions(questions) {
  const quizBox = document.getElementById("quizBox");
  quizBox.innerHTML = "";

  questions.forEach((q, index) => {
    const block = document.createElement("div");
    block.className = "question-block";

    block.innerHTML = `
      <h2>Question ${index + 1}</h2>
      <p>${q.question}</p>

      ${q.image ? `<img src="../../../${q.image}" class="quiz-image">` : ""}

      ${q.code ? `<pre class="code-block">${q.code}</pre>` : ""}

      <div class="options">
        ${q.options.map(option => `
          <button class="option-btn">${option}</button>
        `).join("")}
      </div>

      <p class="answer-text"></p>
    `;

    quizBox.appendChild(block);

    const buttons = block.querySelectorAll(".option-btn");

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

          block.querySelector(".answer-text").innerText =
            q.wrong_explanations?.[selected] ||
            `Correct Answer: ${correct}`;
        }

        document.getElementById("scoreBoard").innerText = `Score: ${score}`;
      });
    });
  });
}

function highlightActiveTopic() {
  document.querySelectorAll(".sidebar-link").forEach(link => {
    link.classList.remove("active-topic");

    const topic = new URL(link.href).searchParams.get("topic");

    if (topic === currentTopic) {
      link.classList.add("active-topic");
    }
  });
}