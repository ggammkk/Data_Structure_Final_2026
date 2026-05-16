#ifndef INTERVIEW_H
#define INTERVIEW_H

#include <string>
#include <vector>

using namespace std;

struct InterviewQuestion {
    int id;
    string question;
    string answer;
    string category;
    string difficulty;
    vector<string> key_points;
};

class Interview {
public:
    vector<InterviewQuestion> getRandomQuestions(int count);
    string questionsToJson(vector<InterviewQuestion> questions);
};

#endif