#include<iostream>
#include "graph.h"

using namespace std;

void Graph:: addNode(Node node){
    nodes[node.name] = node;
}

void Graph:: addEdge(string source, string target, string type){
    adjacencyList[source].push_back({target,type});

    if(type == "parent_of")
    {adjacencyList[target].push_back({source,"child_of"});}

    else if(type == "uses")
    {adjacencyList[target].push_back({source,"used_in"});}

    else if(type == "is_a")
    {adjacencyList[target].push_back({source,"child_of"});}

}

void Graph::printGraph(){
    for(auto& node : adjacencyList){
        cout << node.first << ":\n";

        for(auto& edge : node.second){
            cout << "  ->" << edge.first << " (" << edge.second << ")\n";
        }
        cout << endl;
    }
}