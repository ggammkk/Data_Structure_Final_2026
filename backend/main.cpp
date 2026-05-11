#include <iostream>
#include <fstream>

#include "json.hpp"
#include "graph.h"

using json = nlohmann::json;
using namespace std;

int main()
{
<<<<<<< HEAD
    ifstream file("../data/dsa_nodes.json");



    if(!file)
=======

    ifstream file("../data/dsa_nodes.json");

    if (!file)
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
    {
        cout << "Failed to open JSON file.\n";

        return 1;
    }



    json data;

    file >> data;



    Graph graph;

<<<<<<< HEAD


    // =====================================
    // FIRST PASS:
    // ADD ALL NODES
    // =====================================
    for(auto& item : data)
    {
        Node node;



        // BASIC INFO
=======
    for (auto &item : data)
    {

        Node node;

        // basic info
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
        node.name = item["name"];

        node.definition = item["definition"];

        node.category = item["category"];

<<<<<<< HEAD


        // OPERATIONS
        for(auto& op : item["operations"])
=======
        // operation
        for (auto &op : item["operations"])
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
        {
            node.operations.push_back(op);
        }

<<<<<<< HEAD


        // RELATIONSHIPS
        for(auto& rel : item["relationships"])
=======
        // relationship
        for (auto &rel : item["relationships"])
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
        {
            Relationship relationship;

            relationship.target = rel["target"];

            relationship.type = rel["type"];

            node.relationships.push_back(relationship);
        }

<<<<<<< HEAD


        // CODE EXAMPLES
        for(auto& code : item["code_examples"])
=======
        // code example
        for (auto &code : item["code_examples"])
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
        {
            node.code_examples.push_back(code);
        }

<<<<<<< HEAD


        // REAL LIFE EXAMPLES
        for(auto& example : item["real_life_examples"])
=======
        // real life example
        for (auto &example : item["real_life_examples"])
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
        {
            node.real_life_examples.push_back(example);
        }

<<<<<<< HEAD


        // MATH RELATIONS
        for(auto& math : item["math_relations"])
=======
        // math relations
        for (auto &math : item["math_relations"])
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
        {
            node.math_relations.push_back(math);
        }

<<<<<<< HEAD


        // TIME COMPLEXITY
        for(auto& tc : item["time_complexity"].items())
=======
        // timecomplexity
        for (auto &tc : item["time_complexity"].items())
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
        {
            node.time_complexity[tc.key()] = tc.value();
        }

<<<<<<< HEAD


        // ADD NODE
        graph.addNode(node);
    }



    // =====================================
    // SECOND PASS:
    // ADD ALL EDGES
    // =====================================
    for(auto& item : data)
    {
        string source = item["name"];



        for(auto& rel : item["relationships"])
        {
            string target = rel["target"];

            string type = rel["type"];



            graph.addEdge(source, target, type);
=======
        // add node
        graph.addNode(node);

        // add relationships
        for (auto &rel : node.relationships)
        {
            graph.addEdge(node.name, rel.target, rel.type);
>>>>>>> 5f805fc657234ee291ddf5e3c62e4c2b02a4ad2d
        }
    }



    // PRINT GRAPH
    graph.printGraph();



    system("pause");



    return 0;
}