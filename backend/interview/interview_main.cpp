#include <iostream>
#include <string>
#include <vector>
#include "interview.h"

using namespace std;

int main(int argc, char* argv[])
{
    int count = 10;

    if (argc > 1)
    {
        count = stoi(argv[1]);
    }

    Interview interview;

    vector<InterviewQuestion> questions =
        interview.getRandomQuestions(count);

    cout << interview.questionsToJson(questions);

    return 0;
}