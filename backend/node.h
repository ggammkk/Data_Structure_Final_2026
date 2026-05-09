#ifndef NODE_H
#define NODE_H

#include <vector>
#include <string>

using namespace std;

struct Node
{
    string name;
    string definition;
    string category;

    vector<string> operations;
    vector<string> related_topics;

    string code_examples;
    string real_life_examples;
    string math_relations;

    vector<string> time_complexity;
};

#endif