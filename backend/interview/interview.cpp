#include "interview.h"
#include <fstream>
#include <filesystem>
#include <algorithm>
#include <random>
#include "../json/json.hpp"

using json = nlohmann::json;
using namespace std;

vector<InterviewQuestion> Interview::getRandomQuestions(int count)
{
    vector<InterviewQuestion> allQuestions;
    vector<InterviewQuestion> selectedQuestions;

    filesystem::path interviewPath =
        filesystem::current_path().parent_path().parent_path()
        / "data" / "interview.json";

    ifstream file(interviewPath);

    if (!file.is_open())
    {
        return selectedQuestions;
    }

    json j;
    file >> j;

    for (const auto& item : j)
    {
        InterviewQuestion q;

        q.id = item.value("id", 0);
        q.question = item.value("question", "");
        q.answer = item.value("answer", "");
        q.category = item.value("category", "");
        q.difficulty = item.value("difficulty", "");

        if (item.contains("key_points"))
        {
            q.key_points = item["key_points"].get<vector<string>>();
        }

        allQuestions.push_back(q);
    }

    random_device rd;
    mt19937 generator(rd());

    shuffle(allQuestions.begin(), allQuestions.end(), generator);

    for (int i = 0; i < count && i < allQuestions.size(); i++)
    {
        selectedQuestions.push_back(allQuestions[i]);
    }

    return selectedQuestions;
}

string Interview::questionsToJson(vector<InterviewQuestion> questions)
{
    json j = json::array();

    for (const auto& q : questions)
    {
        j.push_back({
            {"id", q.id},
            {"question", q.question},
            {"answer", q.answer},
            {"category", q.category},
            {"difficulty", q.difficulty},
            {"key_points", q.key_points}
        });
    }

    return j.dump();
}