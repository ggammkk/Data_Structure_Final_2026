#include <iostream>
#include <fstream>

#include "json.hpp"
#include "graph.h"
#include "search.h"

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
    // =====================================
    // FIRST PASS:
    // ADD ALL NODES
    // =====================================
    for (auto &item : data)
    {
        Node node;

        // BASIC INFO
        node.name = item["name"];
        node.definition = item["definition"];
        node.category = item["category"];

        // OPERATIONS
        for (auto &op : item["operations"])
        {
            node.operations.push_back(op);
        }

        // RELATIONSHIPS
        for (auto &rel : item["relationships"])
        {
            Relationship relationship;
            relationship.target = rel["target"];
            relationship.type = rel["type"];
            node.relationships.push_back(relationship);
        }

        // CODE EXAMPLES
        for (auto &code : item["code_examples"])
        {
            node.code_examples.push_back(code);
        }

        // REAL LIFE EXAMPLES
        for (auto &example : item["real_life_examples"])
        {
            node.real_life_examples.push_back(example);
        }

        // MATH RELATIONS
        for (auto &math : item["math_relations"])
        {
            node.math_relations.push_back(math);
        }

        // TIME COMPLEXITY
        for (auto &tc : item["time_complexity"].items())
        {
            node.time_complexity[tc.key()] = tc.value();
        }

        graph.addNode(node);
    }

    // =====================================
    // SECOND PASS:
    // ADD ALL EDGES
    // =====================================
    for (auto &item : data)
    {
        string source = item["name"];

        for (auto &rel : item["relationships"])
        {
            graph.addEdge(source, rel["target"], rel["type"]);
        }
    }

    // graph.printGraph();

    // Allows user to search test  might not be permanent
    Search search(&graph);

    cout << "\n===== Interactive Search System =====\n";
    cout << "Type a question, or type exit to quit.\n";

    string query;

    while (true)
    {
        cout << "\nAsk something: ";
        getline(cin, query);

        if (query == "exit")
        {
            break;
        }

        cout << search.generateResponse(query) << endl;
    }

    system("pause");

    return 0;
}
