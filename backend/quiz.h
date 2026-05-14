#ifndef QUIZ_H
#define QUIZ_H
#include <string>
#include <vector>
using namespace std;

struct QuizQuestion{
    string question;
    string code;
    vector<string> options;
    string answer;
};

class Quiz{
    public:
        vector<QuizQuestion> generateQuiz(string topic);
        string quizTojson(vector<QuizQuestion> question);
};
#endif
