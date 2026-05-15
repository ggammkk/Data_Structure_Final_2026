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

    Quiz quiz;

    vector<QuizQuestion> questions = quiz.generateQuiz(topic);

    cout << quiz.quizTojson(questions);

    return 0;
}