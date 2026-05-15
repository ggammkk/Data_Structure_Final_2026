let quizData = {};

fetch("http://localhost:3000/api/quiz-topics")
  .then(res => res.json())
  .then(data => {
    quizData = data;
    loadTopics();
  });

function loadTopics() {

  const topics = quizData;

  document.getElementById("topicList").innerHTML =
    `
      <ul class="topic-ul">
        ${topics.map(topic => `
          <li>
            <a href="quiz/quiz.html?topic=${encodeURIComponent(topic)}">
              ${topic}
            </a>
          </li>
        `).join("")}
      </ul>
    `;
}