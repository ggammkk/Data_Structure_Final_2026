#ifndef SEARCH_H
#define SEARCH_H

#include <string>
#include <vector>
#include "graph.h"
#include "node.h"

using namespace std;

class Search
{
private:
    Graph* graph;

public:
    Search(Graph* g);

    vector<Node> searchByName(string name);
    vector<Node> searchByCategory(string category);
    vector<Node> searchByOperation(string operation);
    vector<Node> searchByRelationship(string relationshipType);

    vector<string> bfsTraversal(string startNode);
    vector<string> dfsTraversal(string startNode);

    string detectIntent(string query);
    string extractTopic(string query);

    string generateFullNodeResponse(Node node);
    string generateResponse(string query);
};

#endif