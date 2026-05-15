#include <iostream>
#include <string>
#include <vector>
#include "practice.h"

using namespace std;

int main(int argc, char* argv[])
{
    string topic = "Stack";

    if (argc > 1)
    {
        topic = "";

        for (int i = 1; i < argc; i++)
        {
            if (i > 1)
            {
                topic += " ";
            }

            topic += argv[i];
        }
    }

    Practice practice;
    vector<PracticeProblem> problems = practice.getProblems(topic);

    cout << practice.problemsToJson(problems);

    return 0;
}