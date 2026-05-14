#include <iostream>
#include <fstream>
#include <filesystem>
#include <vector>
#include <string>

#include "json.hpp"
#include "graph.h"
#include "search.h"

using json = nlohmann::json;
using namespace std;

int main(int argc, char *argv[])
{

    std::filesystem::path jsonPath =
        std::filesystem::current_path().parent_path() / "data" / "dsa_nodes.json";
    std::ifstream file(jsonPath);

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
            if (code.is_string())
            {
                node.code_examples.push_back(code.get<string>());
            }
            else if (code.is_object() && code.contains("code"))
            {
                if (code["code"].is_string())
                {
                    node.code_examples.push_back(code["code"].get<string>());
                }
                else if (code["code"].is_array())
                {
                    string fullCode = "";

                    for (auto &line : code["code"])
                    {
                        fullCode += line.get<string>() + "\n";
                    }

                    node.code_examples.push_back(fullCode);
                }
            }
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
            node.time_complexity[tc.key()] = tc.value().get<string>();
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

    string query;

    if (argc > 1)
    {
        query = argv[1];
    }
    else
    {
        getline(cin, query);
    }

    cout << search.generateResponse(query);

    return 0;
}

#include "extract.h"
/*
int main()
{
    Extractor extractor;

    extractor.convertTxtToJson(
        "../data/dsa_llm_source.txt",
        "../data/dsa_nodes.json"
    );

    return 0;
}
*/