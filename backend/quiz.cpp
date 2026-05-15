#include "quiz.h"
#include <iostream>
#include <fstream>
#include <filesystem>
#include "json.hpp"

using json = nlohmann::json;
using namespace std;

vector<QuizQuestion> Quiz::generateQuiz(string topic)
{
    vector<QuizQuestion> quiz;

    filesystem::path quizPath =
        filesystem::current_path().parent_path() / "data" / "quiz.json";

    ifstream file(quizPath);

    if (!file.is_open())
    {
        cerr << "Failed to open quiz.json" << endl;
        return quiz;
    }

    json j;
    file >> j;

    if (!j.contains(topic))
    {
        cerr << "Topic not found: " << topic << endl;
        return quiz;
    }

    for (const auto& item : j[topic])
    {
        QuizQuestion q;
        q.topic = item.value("topic", topic);
        q.question = item.value("question", "");
        q.code = item.value("code", "");
        q.image = item.value("image", "");
        q.options = item["options"].get<vector<string>>();
        q.answer = item.value("answer", "");

        quiz.push_back(q);
    }

    return quiz;
}

string Quiz::quizTojson(vector<QuizQuestion> questions)
{
    json j = json::array();

    for (const auto& q : questions)
    {
        j.push_back({
            {"topic", q.topic},
            {"question", q.question},
            {"code", q.code},
            {"image", q.image},
            {"options", q.options},
            {"answer", q.answer}
        });
    }

    return j.dump();
}