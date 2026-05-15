#ifndef QUIZ_H
#define QUIZ_H
#include <string>
#include <vector>
using namespace std;

struct QuizQuestion{
    string topic;
    string question;
    string code;
    string image;
    vector<string> options;
    string answer;
};

class Quiz{
    public:
        vector<QuizQuestion> generateQuiz(string topic);
        string quizTojson(vector<QuizQuestion> question);
};
#endif
