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
  topics.map(t =>
    `
      <li>
        <a href="quiz/quiz.html?topic=${encodeURIComponent(t)}">
          ${t}
        </a>
      </li>
    `
  ).join("");
}