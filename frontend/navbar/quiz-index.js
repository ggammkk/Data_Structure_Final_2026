let quizData = {}; // store quiz topics list from backend

// fetch quiz topics 
fetch("http://localhost:3000/api/quiz-topics")
  .then(res => res.json()) // convert response to a js array
  .then(data => {
    quizData = data; // store data into global variable
    loadTopics();
  });

// load quiz topic links into sidebar
function loadTopics() {
  const topics = quizData;
  document.getElementById("topicList").innerHTML =
  topics.map(t => // goes thru every topic and make a list out of it
    `
      <li>
        <a href="quiz/quiz.html?topic=${encodeURIComponent(t)}"> // put the topic name as the link
          ${t}
        </a>
      </li>
    `
  ).join("");
}