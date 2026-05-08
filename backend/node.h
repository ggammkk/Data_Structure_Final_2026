#ifndef NODE_H
#define NODE_H

#include <vector>
#include <string>

using namespace std;

struct Node
{
    string name;
    string def;
    string category;

    vector<string> operations;
    vector<string> related;

    string codeexample;
    string reallifeexample;
    string mathrelation;

    string timecomplexity;
};

#endif