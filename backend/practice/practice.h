#ifndef PRACTICE_H
#define PRACTICE_H

#include <string>
#include <vector>

using namespace std;

struct PracticeProblem {
    string topic;
    string title;
    string difficulty;
    string category;
    string problem;
    string example_input;
    string expected_output;
    string starter_code;
    string hint;
    string solution;
    vector<string> explanation;
};

class Practice {
public:
    vector<PracticeProblem> getProblems(string topic);
    string problemsToJson(vector<PracticeProblem> problems);
};

#endif