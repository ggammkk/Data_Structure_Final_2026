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

        unordered_map<string,vector<pair<string,string>>> adjacencyList;

    public:
        void addNode(Node node);

        void addEdge(string source, string target, string type);
        void printGraph();
};

#endif