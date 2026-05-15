#include <iostream>
#include <string>
#include <vector>
#include "quiz.h"

using namespace std;

int main(int argc, char* argv[])
{
    string topic = "Data";

    if (argc > 1)
    {
        topic = argv[1];
    }

    Quiz quiz;

    vector<QuizQuestion> questions = quiz.generateQuiz(topic);

    cout << quiz.quizTojson(questions);

    return 0;
}