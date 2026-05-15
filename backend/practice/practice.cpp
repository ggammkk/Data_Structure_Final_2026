#include "practice.h"
#include <fstream>
#include <filesystem>
#include "../json/json.hpp"

using json = nlohmann::json;
using namespace std;

vector<PracticeProblem> Practice::getProblems(string topic)
{
    vector<PracticeProblem> problems;

    filesystem::path practicePath =
        filesystem::current_path().parent_path().parent_path()
        / "data" / "practice.json";

    ifstream file(practicePath);

    if (!file.is_open())
    {
        return problems;
    }

    json j;
    file >> j;

    if (!j.contains(topic))
    {
        return problems;
    }

    for (const auto& item : j[topic])
    {
        PracticeProblem p;

        p.topic = item.value("topic", topic);
        p.title = item.value("title", "");
        p.difficulty = item.value("difficulty", "");
        p.category = item.value("category", "");
        p.problem = item.value("problem", "");
        p.example_input = item.value("example_input", "");
        p.expected_output = item.value("expected_output", "");
        p.starter_code = item.value("starter_code", "");
        p.hint = item.value("hint", "");
        p.solution = item.value("solution", "");

        if (item.contains("explanation"))
        {
            p.explanation = item["explanation"].get<vector<string>>();
        }

        problems.push_back(p);
    }

    return problems;
}

string Practice::problemsToJson(vector<PracticeProblem> problems)
{
    json j = json::array();

    for (const auto& p : problems)
    {
        j.push_back({
            {"topic", p.topic},
            {"title", p.title},
            {"difficulty", p.difficulty},
            {"category", p.category},
            {"problem", p.problem},
            {"example_input", p.example_input},
            {"expected_output", p.expected_output},
            {"starter_code", p.starter_code},
            {"hint", p.hint},
            {"solution", p.solution},
            {"explanation", p.explanation}
        });
    }

    return j.dump();
}