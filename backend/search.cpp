#include <algorithm>
#include "search.h"
#include <iostream>
#include <queue>
#include <unordered_set>
#include <vector>
#include <stack>
using namespace std;

// Basic search functions
string toLowerCases(string text)
{
    transform(text.begin(), text.end(), text.begin(), ::tolower);
    return text;
}

vector<Node> Search::searchByName(string name)
{
    vector<Node> exactResults;
    vector<Node> partialResults;
    name = toLowerCases(name);

    for (auto &pair : graph->getNodes())
    {
        Node node = pair.second;
        string nodeName = toLowerCases(node.name);

        if (nodeName == name)
        {
            exactResults.push_back(node);
        }
        else if (nodeName.find(name) != string::npos)
        {
            partialResults.push_back(node);
        }
    }

    if (!exactResults.empty())
    {
        return exactResults;
    }

    return partialResults;
}

vector<Node> Search::searchByCategory(string category)
{
    vector<Node> results;
    category = toLowerCases(category);

    for (auto &pair : graph->getNodes())
    {
        Node node = pair.second;

        if (toLowerCases(node.category).find(category) != string::npos)
        {
            results.push_back(node);
        }
    }
    return results;
}

vector<Node> Search::searchByOperation(string operation)
{
    vector<Node> results;
    operation = toLowerCases(operation);

    for (auto &pair : graph->getNodes())
    {
        Node node = pair.second;

        for (string op : node.operations)
        {
            if (toLowerCases(op).find(operation) != string::npos)
            {
                results.push_back(node);
                break;
            }
        }
    }
    return results;
}

vector<Node> Search::searchByRelationship(string relationshipType)
{
    vector<Node> results;
    relationshipType = toLowerCases(relationshipType);

    for (auto &pair : graph->getNodes())
    {
        Node node = pair.second;

        for (Relationship rel : node.relationships)
        {
            if (toLowerCases(rel.type).find(relationshipType) != string::npos)
            {
                results.push_back(node);
                break;
            }
        }
    }
    return results;
}

vector<string> Search::bfsTraversal(string startNode)
{
    vector<string> visitedOrder;
    queue<string> q;
    unordered_set<string> visited;

    vector<Node> startResults = searchByName(startNode);

    if (startResults.empty())
    {
        return visitedOrder;
    }

    string start = startResults[0].name;
    q.push(start);
    visited.insert(start);

    while (!q.empty())
    {
        string current = q.front();
        q.pop();
        visitedOrder.push_back(current);
        auto adjacencyList = graph->getAdjacencyList();

        for (auto &edge : adjacencyList[current])
        {
            string neighbor = edge.first;
            if (visited.find(neighbor) == visited.end())
            {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return visitedOrder;
}

// Advanced search features(Query understanding, intent detection, topic extraction)
string Search::detectIntent(string query)
{
    query = toLowerCases(query);

    if (query.find("definition") != string::npos || query.find("what is") != string::npos || query.find("define") != string::npos)
    {
        return "definition";
    }

    else if (query.find("category") != string::npos || query.find("type") != string::npos)
    {
        return "category";
    }

    else if (query.find("how to") != string::npos || query.find("example") != string::npos)
    {
        return "example";
    }

    else if (query.find("complexity") != string::npos || query.find("time") != string::npos || query.find("big o") != string::npos || query.find("time complexity") != string::npos)
    {
        return "time_complexity";
    }

    else if (query.find("operation") != string::npos || query.find("operations") != string::npos)
    {
        return "operations";
    }

    else if (query.find("related") != string::npos || query.find("connected") != string::npos || query.find("relationship") != string::npos)
    {
        return "related";
    }

    else if (query.find("real life") != string::npos || query.find("real-life") != string::npos || query.find("application") != string::npos || query.find("applications") != string::npos || query.find("uses") != string::npos)
    {
        return "real_life_examples";
    }

    else if (query.find("math") != string::npos || query.find("formula") != string::npos || query.find("equation") != string::npos || query.find("relation") != string::npos)
    {
        return "math_relations";
    }

    else
    {
        return "general_search";
    }
}

string Search::extractTopic(string query)
{
    query = toLowerCases(query);

    // Remove common intent keywords
    vector<string> intentKeywords = {"code examples", "code example",
                                     "real life examples", "real-life examples",
                                     "math relations", "math relation",
                                     "time complexity",
                                     "related topics", "related topic",
                                     "what is", "define", "definition",
                                     "category", "type",
                                     "how to", "examples", "example",
                                     "complexity", "time", "big o",
                                     "operation", "operations",
                                     "related", "connected", "relationship",
                                     "real life", "real-life", "applications", "application",
                                     "math", "formula", "equation", "relation",
                                     "of"};
    for (string keyword : intentKeywords)
    {
        size_t pos = query.find(keyword);
        if (pos != string::npos)
        {
            query.erase(pos, keyword.length());
        }
    }

    query.erase(remove(query.begin(), query.end(), '?'), query.end());

    // Handling whitespace
    query.erase(0, query.find_first_not_of(" \t"));

    if (!query.empty())
    {
        query.erase(query.find_last_not_of(" \t") + 1);
    }

    // removes the a, and, an
    if (query.rfind("a ", 0) == 0)
    {
        query.erase(0, 2);
    };
    if (query.rfind("an ", 0) == 0)
    {
        query.erase(0, 3);
    };
    if (query.rfind("the ", 0) == 0)
    {
        query.erase(0, 4);
    }

    return query;
}

// Responses
string Search::generateFullNodeResponse(Node node)
{
    string response = "";
    response += "\n===== " + node.name + " =====\n\n";

    response += "Definition:\n";
    response += node.definition + "\n\n";

    response += "Category:\n";
    response += node.category + "\n\n";

    response += "Operations:\n";
    if (node.operations.empty())
    {
        response += "None\n";
    }
    else
    {
        for (string op : node.operations)
        {
            response += "- " + op + "\n";
        }
    }

    response += "\nRelationships:\n";
    if (node.relationships.empty())
    {
        response += "None\n";
    }
    else
    {
        for (Relationship rel : node.relationships)
        {
            response += "- " + rel.target + " (" + rel.type + ")\n";
        }
    }

    response += "\nCode Examples:\n";
    if (node.code_examples.empty())
    {
        response += "None\n";
    }
    else
    {
        for (string code : node.code_examples)
        {
            response += "- " + code + "\n";
        }
    }

    response += "\nReal-Life Examples:\n";
    if (node.real_life_examples.empty())
    {
        response += "None\n";
    }
    else
    {
        for (string example : node.real_life_examples)
        {
            response += "- " + example + "\n";
        }
    }

    response += "\nMath Relations:\n";
    if (node.math_relations.empty())
    {
        response += "None\n";
    }
    else
    {
        for (string math : node.math_relations)
        {
            response += "- " + math + "\n";
        }
    }

    response += "\nTime Complexity:\n";
    if (node.time_complexity.empty())
    {
        response += "None\n";
    }
    else
    {
        for (auto tc : node.time_complexity)
        {
            response += "- " + tc.first + ": " + tc.second + "\n";
        }
    }

    return response;
}
string Search::generateResponse(string query)
{
    string intent = detectIntent(query);
    string topic = extractTopic(query);
    // temporary remove the line below later
    cout << "DEBUG topic = [" << topic << "]\n";

    if (topic.empty())
    {
        return "Please include a topic, for example: math relations of binary search tree.";
    }

    vector<Node> results = searchByName(topic);

    if (results.empty())
    {
        return "Sorry, this topic can not be found in the knowledge graph.";
    }

    Node node = results[0];

    if (intent == "definition")
    {
        return generateFullNodeResponse(node);
    }

    if (intent == "category")
    {
        return node.name + " belongs to the category: " + node.category;
    }

    if (intent == "operations")
    {
        if (node.operations.empty())
            return "No operations found for " + node.name + ".";

        string response = "Common operations of " + node.name + " are:\n";

        for (string op : node.operations)
        {
            response += "- " + op + "\n";
        }

        return response;
    }

    if (intent == "time_complexity")
    {
        if (node.time_complexity.empty())
            return "No time complexity information found for " + node.name + ".";

        string response = "Time complexities for " + node.name + ":\n";

        for (auto tc : node.time_complexity)
        {
            response += "- " + tc.first + ": " + tc.second + "\n";
        }

        return response;
    }

    if (intent == "related")
    {
        if (node.relationships.empty())
            return "No related topics found for " + node.name + ".";

        string response = "Topics related to " + node.name + " are:\n";

        for (Relationship rel : node.relationships)
        {
            response += "- " + rel.target + " (" + rel.type + ")\n";
        }

        return response;
    }

    if (intent == "example")
    {
        if (node.code_examples.empty())
            return "No code example found for " + node.name + ".";

        string response = "Code example for " + node.name + ":\n";

        for (string code : node.code_examples)
        {
            response += code + "\n";
        }

        return response;
    }

    if (intent == "real_life_examples")
    {
        if (node.real_life_examples.empty())
            return "No real-life examples found for " + node.name + ".";

        string response = "Real-life examples of " + node.name + " are:\n";

        for (string example : node.real_life_examples)
        {
            response += "- " + example + "\n";
        }

        return response;
    }

    if (intent == "math_relations")
    {
        if (node.math_relations.empty())
            return "No mathematical relations found for " + node.name + ".";

        string response = "Mathematical relations involving " + node.name + " are:\n";

        for (string math : node.math_relations)
        {
            response += "- " + math + "\n";
        }

        return response;
    }

    return generateFullNodeResponse(node);
}