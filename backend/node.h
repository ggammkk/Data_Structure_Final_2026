#ifndef NODE_H
#define NODE_H

#include <vector>
#include <string>
#include <unordered_map>

using namespace std;

struct Relationship
{
    string target;
    string type;
};

struct InterviewQuestion
{
    string question;
    string answer;
};

struct ImageData
{
    string title;
    string url;
};

struct Node
{
    string name;
    string definition;
    string category;
    string difficulty;

    vector<string> operations;
    vector<Relationship> relationships;

    unordered_map<string, string> time_complexity;

    vector<string> real_life_examples;
    vector<InterviewQuestion> interview_questions;

    unordered_map<string, string> code_examples;

    vector<ImageData> images;
    vector<string> step_by_step;
};

#endif