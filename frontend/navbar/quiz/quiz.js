fetch("../../../data/quiz.json")
  .then(res => res.json())
  .then(data => {
    const topic = new URLSearchParams(window.location.search).get("topic");

    const questions = data[topic];

    startQuiz(questions);
  });