#ifndef NODE_H
#define NODE_H

#include <vector>
#include <string>
#include <unordered_map>

using namespace std;

struct Relationship{

    string target;
    string type;
};

struct Node{

    string name;
    string definition;
    string category;

    vector<string> operations;
    vector<Relationship> relationships;

    vector<string> code_examples;
    vector<string> real_life_examples;
    vector<string> math_relations;
    unordered_map<string, string> time_complexity;
};

#endif