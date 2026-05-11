<<<<<<< HEAD
#include<iostream>

=======
#include <iostream>
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
#include "graph.h"

using namespace std;

<<<<<<< HEAD


// =========================
// ADD NODE
// =========================
=======
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
void Graph::addNode(Node node)
{
    nodes[node.name] = node;
}

<<<<<<< HEAD


// =========================
// ADD EDGE
// =========================
void Graph::addEdge(string source,
                    string target,
                    string type)
{
    // ADD ORIGINAL EDGE
    adjacencyList[source].push_back({target, type});



    // =========================
    // AUTO REVERSE RELATIONSHIPS
    // =========================

    // PARENT ↔ CHILD
    if(type == "parent_of")
    {
        adjacencyList[target].push_back({
            source,
            "child_of"
        });
    }



    // USES ↔ USED_IN
    else if(type == "uses")
    {
        adjacencyList[target].push_back({
            source,
            "used_in"
        });
    }



    // IS_A ↔ HAS_TYPE
    else if(type == "is_a")
    {
        adjacencyList[target].push_back({
            source,
            "has_type"
        });
    }



    // IMPLEMENTS ↔ IMPLEMENTED_BY
    else if(type == "implements")
    {
        adjacencyList[target].push_back({
            source,
            "implemented_by"
        });
    }



    // DEPENDS_ON ↔ REQUIRED_BY
    else if(type == "depends_on")
    {
        adjacencyList[target].push_back({
            source,
            "required_by"
        });
    }
}



// =========================
// PRINT GRAPH
// =========================
void Graph::printGraph()
{
    for(auto& node : adjacencyList)
    {
        cout << node.first << ":\n";



        for(auto& edge : node.second)
        {
            cout << "  -> "
                 << edge.first
                 << " ("
                 << edge.second
                 << ")\n";
=======
void Graph::addEdge(string source, string target, string type)
{
    adjacencyList[source].push_back({target, type});

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
        adjacencyList[target].push_back({source, "child_of"});
    }
}

void Graph::printGraph()
{
    for (auto &node : adjacencyList)
    {
        cout << node.first << ":\n";

        for (auto &edge : node.second)
        {
            cout << "  ->" << edge.first << " (" << edge.second << ")\n";
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
        }



        cout << endl;
    }
}

unordered_map<string, Node> &Graph::getNodes()
{
    return nodes;
}

unordered_map<string, vector<pair<string, string>>> &Graph::getAdjacencyList()
{
    return adjacencyList;
}