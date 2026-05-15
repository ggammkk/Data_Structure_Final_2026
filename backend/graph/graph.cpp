#include <iostream>
#include "graph.h"

using namespace std;

// =========================
// ADD NODE
// =========================
void Graph::addNode(Node node)
{
    nodes[node.name] = node;
}

// =========================
// ADD EDGE
// =========================
void Graph::addEdge(string source,
                    string target,
                    string type)
{
    // ADD ORIGINAL EDGE
    adjacencyList[source].push_back({target, type});

    // AUTO REVERSE RELATIONSHIPS

    if (type == "parent_of")
    {
        adjacencyList[target].push_back({source, "child_of"});
    }

    else if (type == "uses")
    {
        adjacencyList[target].push_back({source, "used_in"});
    }

    else if (type == "is_a")
    {
        adjacencyList[target].push_back({source, "has_type"});
    }

    else if (type == "implements")
    {
        adjacencyList[target].push_back({source, "implemented_by"});
    }

    else if (type == "depends_on")
    {
        adjacencyList[target].push_back({source, "required_by"});
    }
}

// =========================
// PRINT GRAPH
// =========================
void Graph::printGraph()
{
    for (auto &node : adjacencyList)
    {
        cout << node.first << ":\n";

        for (auto &edge : node.second)
        {
            cout << "  -> "
                 << edge.first
                 << " ("
                 << edge.second
                 << ")\n";
        }

        cout << endl;
    }
}

// =========================
// GET NODES
// =========================
unordered_map<string, Node> &Graph::getNodes()
{
    return nodes;
}

// =========================
// GET ADJACENCY LIST
// =========================
unordered_map<string, vector<pair<string, string>>> &
Graph::getAdjacencyList()
{
    return adjacencyList;
}