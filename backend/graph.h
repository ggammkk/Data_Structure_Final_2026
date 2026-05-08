#ifndef GRAPH_H
#define GRAPH_H

#include "node.h"

#include<unordered_map>
#include<vector>
#include<string>
using namespace std;

class Graph {
    private:
        unordered_map<string, Node> nodes;

    public:
        void addNode(Node node);
};

#endif