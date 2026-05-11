#ifndef SEARCH_H
#define SEARCH_H

#include "graph.h"

class Search
{
private:
    Graph *graph;

public:
    Search(Graph *g) : graph(g) {};

    // Basic search functions(algorithms)
    vector<Node> searchByName(string name);
    vector<Node> searchByCategory(string category);
    vector<Node> searchByOperation(string operation);
    vector<Node> searchByRelationship(string relationshipType);

    // Advanced search features(Query understanding, intent detection, topic extraction)
    string detectIntent(string query);
    string extractTopic(string query);
};

#endif