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
    }
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

        // operation
        for (auto &op : item["operations"])

            // OPERATIONS
            for (auto &op : item["operations"])
            {
                node.operations.push_back(op);
            }

        // relationship
        for (auto &rel : item["relationships"])

            // RELATIONSHIPS
            for (auto &rel : item["relationships"])
            {
                Relationship relationship;
                relationship.target = rel["target"];
                relationship.type = rel["type"];
                node.relationships.push_back(relationship);
            }

        // code example
        for (auto &code : item["code_examples"])

            // CODE EXAMPLES
            for (auto &code : item["code_examples"])
            {
                node.code_examples.push_back(code);
            }

        // real life example
        for (auto &example : item["real_life_examples"])

            // REAL LIFE EXAMPLES
            for (auto &example : item["real_life_examples"])
            {
                node.real_life_examples.push_back(example);
            }

        // math relations
        for (auto &math : item["math_relations"])

            // MATH RELATIONS
            for (auto &math : item["math_relations"])
            {
                node.math_relations.push_back(math);
            }

        // timecomplexity
        for (auto &tc : item["time_complexity"].items())

            // TIME COMPLEXITY
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

            // ADD NODE
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
                string target = rel["target"];

                string type = rel["type"];

                graph.addEdge(source, target, type);
            }
        }

        graph.printGraph();

        // Allows user to search
        Search search(&graph);

        string query;
        cout << "Ask something: ";
        getline(cin, query);

        cout << "Intent: " << search.detectIntent(query) << endl;
        cout << "Topic: " << search.extractTopic(query) << endl;

        system("pause");

        return 0;
    }
}
