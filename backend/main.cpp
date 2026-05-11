#include <iostream>
#include <fstream>

#include "json.hpp"
#include "graph.h"

using json = nlohmann::json;
using namespace std;

int main()
{

    ifstream file("../data/dsa_nodes.json");

    if (!file)
    {
        cout << "Failed to open JSON file.\n";
        return 1;
    }

    json data;
    file >> data;

    Graph graph;

    for (auto &item : data)
    {

        Node node;

        // basic info
        node.name = item["name"];
        node.definition = item["definition"];
        node.category = item["category"];

        // operation
        for (auto &op : item["operations"])
        {
            node.operations.push_back(op);
        }

        // relationship
        for (auto &rel : item["relationships"])
        {
            Relationship relationship;
            relationship.target = rel["target"];
            relationship.type = rel["type"];
            node.relationships.push_back(relationship);
        }

        // code example
        for (auto &code : item["code_examples"])
        {
            node.code_examples.push_back(code);
        }

        // real life example
        for (auto &example : item["real_life_examples"])
        {
            node.real_life_examples.push_back(example);
        }

        // math relations
        for (auto &math : item["math_relations"])
        {
            node.math_relations.push_back(math);
        }

        // timecomplexity
        for (auto &tc : item["time_complexity"].items())
        {
            node.time_complexity[tc.key()] = tc.value();
        }

        // add node
        graph.addNode(node);

        // add relationships
        for (auto &rel : node.relationships)
        {
            graph.addEdge(node.name, rel.target, rel.type);
        }
    }

    graph.printGraph();

    system("pause");

    return 0;
}
