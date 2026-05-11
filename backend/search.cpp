#include <algorithm>
#include "search.h"

string toLowerCases(string text)
{
    transform(text.begin(), text.end(), text.begin(), ::tolower);
    return text;
}

vector<Node> Search::searchByName(string name)
{
    vector<Node> results;
    name = toLowerCases(name);

    for (auto &pair : graph->getNodes())
    {
        Node node = pair.second;

        if (toLowerCases(node.name).find(name) != string::npos)
        {
            results.push_back(node);
        }
    }
    return results;
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
