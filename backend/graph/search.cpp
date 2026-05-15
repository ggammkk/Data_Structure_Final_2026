#include "search.h"

#include <algorithm>
#include <iostream>
#include <queue>
#include <stack>
#include <unordered_set>
#include <vector>

using namespace std;


string toLowerCases(string text)
{
    transform(text.begin(), text.end(), text.begin(), ::tolower);
    return text;
}

// =========================
// CONSTRUCTOR
// =========================

Search::Search(Graph* g)
{
    graph = g;
}

// =========================
// BASIC SEARCH FUNCTIONS
// =========================

vector<Node> Search::searchByName(string name)
{
    vector<Node> exactResults;
    vector<Node> partialResults;

    name = toLowerCases(name);

    for(auto& pair : graph->getNodes())
    {
        Node node = pair.second;
        string nodeName = toLowerCases(node.name);

        if(nodeName == name)
        {
            exactResults.push_back(node);
        }
        else if(nodeName.find(name) != string::npos)
        {
            partialResults.push_back(node);
        }
    }

    if(!exactResults.empty())
    {
        return exactResults;
    }

    return partialResults;
}

vector<Node> Search::searchByCategory(string category)
{
    vector<Node> results;

    category = toLowerCases(category);

    for(auto& pair : graph->getNodes())
    {
        Node node = pair.second;

        if(toLowerCases(node.category).find(category) != string::npos)
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

    for(auto& pair : graph->getNodes())
    {
        Node node = pair.second;

        for(string op : node.operations)
        {
            if(toLowerCases(op).find(operation) != string::npos)
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

    for(auto& pair : graph->getNodes())
    {
        Node node = pair.second;

        for(Relationship rel : node.relationships)
        {
            if(toLowerCases(rel.type).find(relationshipType) != string::npos)
            {
                results.push_back(node);
                break;
            }
        }
    }

    return results;
}

// =========================
// BFS TRAVERSAL
// =========================

vector<string> Search::bfsTraversal(string startNode)
{
    vector<string> visitedOrder;
    queue<string> q;
    unordered_set<string> visited;

    vector<Node> startResults = searchByName(startNode);

    if(startResults.empty())
    {
        return visitedOrder;
    }

    string start = startResults[0].name;

    q.push(start);
    visited.insert(start);

    while(!q.empty())
    {
        string current = q.front();
        q.pop();

        visitedOrder.push_back(current);

        auto adjacencyList = graph->getAdjacencyList();

        for(auto& edge : adjacencyList[current])
        {
            string neighbor = edge.first;

            if(visited.find(neighbor) == visited.end())
            {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }

    return visitedOrder;
}

// =========================
// DFS TRAVERSAL
// =========================

vector<string> Search::dfsTraversal(string startNode)
{
    vector<string> visitedOrder;
    stack<string> s;
    unordered_set<string> visited;

    vector<Node> startResults = searchByName(startNode);

    if(startResults.empty())
    {
        return visitedOrder;
    }

    string start = startResults[0].name;

    s.push(start);

    while(!s.empty())
    {
        string current = s.top();
        s.pop();

        if(visited.find(current) != visited.end())
        {
            continue;
        }

        visited.insert(current);
        visitedOrder.push_back(current);

        auto adjacencyList = graph->getAdjacencyList();

        for(auto& edge : adjacencyList[current])
        {
            string neighbor = edge.first;

            if(visited.find(neighbor) == visited.end())
            {
                s.push(neighbor);
            }
        }
    }

    return visitedOrder;
}

// =========================
// INTENT DETECTION
// =========================

string Search::detectIntent(string query)
{
    query = toLowerCases(query);

    if(query.find("interview") != string::npos ||
       query.find("question") != string::npos)
    {
        return "interview_questions";
    }

    else if(query.find("step") != string::npos ||
            query.find("process") != string::npos ||
            query.find("how does") != string::npos)
    {
        return "step_by_step";
    }

    else if(query.find("image") != string::npos ||
            query.find("diagram") != string::npos ||
            query.find("picture") != string::npos)
    {
        return "images";
    }

    else if(query.find("difficulty") != string::npos ||
            query.find("level") != string::npos)
    {
        return "difficulty";
    }

    else if(query.find("definition") != string::npos ||
            query.find("what is") != string::npos ||
            query.find("define") != string::npos)
    {
        return "definition";
    }

    else if(query.find("category") != string::npos ||
            query.find("type") != string::npos)
    {
        return "category";
    }

    else if(query.find("cpp") != string::npos ||
            query.find("c++") != string::npos ||
            query.find("python") != string::npos ||
            query.find("java") != string::npos ||
            query.find("code") != string::npos ||
            query.find("example") != string::npos)
    {
        return "code_examples";
    }

    else if(query.find("complexity") != string::npos ||
            query.find("time") != string::npos ||
            query.find("big o") != string::npos)
    {
        return "time_complexity";
    }

    else if(query.find("operations") != string::npos ||
            query.find("operation") != string::npos)
    {
        return "operations";
    }

    else if(query.find("related") != string::npos ||
            query.find("relations") != string::npos ||
            query.find("connected") != string::npos ||
            query.find("relationship") != string::npos)
    {
        return "related";
    }

    else if(query.find("real life") != string::npos ||
            query.find("real-life") != string::npos ||
            query.find("application") != string::npos ||
            query.find("applications") != string::npos ||
            query.find("uses") != string::npos)
    {
        return "real_life_examples";
    }

    else if(query.find("math") != string::npos ||
            query.find("formula") != string::npos ||
            query.find("equation") != string::npos)
    {
        return "math_relations";
    }

    else if(query.find("bfs traversal") != string::npos ||
            query.find("traverse bfs") != string::npos ||
            query.find("breadth first traversal") != string::npos ||
            query.find("breadth first") != string::npos ||
            query.find("bfs") != string::npos)
    {
        return "bfs";
    }

    else if(query.find("dfs traversal") != string::npos ||
            query.find("traverse dfs") != string::npos ||
            query.find("depth first traversal") != string::npos ||
            query.find("depth first") != string::npos ||
            query.find("dfs") != string::npos)
    {
        return "dfs";
    }

    return "general_search";
}

// =========================
// TOPIC EXTRACTION
// =========================

string Search::extractTopic(string query)
{
    query = toLowerCases(query);

    vector<string> intentKeywords = {
        "interview questions",
        "interview question",
        "interview",
        "questions",
        "question",
        "step by step",
        "steps",
        "step",
        "process",
        "how does",
        "image",
        "images",
        "diagram",
        "diagrams",
        "picture",
        "pictures",
        "difficulty",
        "level",
        "code examples",
        "code example",
        "cpp code",
        "c++ code",
        "python code",
        "java code",
        "cpp",
        "c++",
        "python",
        "java",
        "code",
        "examples",
        "example",
        "real life examples",
        "real-life examples",
        "math relations",
        "math relation",
        "time complexity",
        "related topics",
        "related topic",
        "what is",
        "define",
        "definition",
        "category",
        "type",
        "how to",
        "complexity",
        "time",
        "big o",
        "operations",
        "operation",
        "relationships",
        "relationship",
        "relations",
        "relation",
        "related",
        "connected",
        "real life",
        "real-life",
        "applications",
        "application",
        "uses",
        "math",
        "formula",
        "equation",
        "of",
        "for",
        "about",
        "bfs",
        "breadth first search",
        "breadth first",
        "dfs",
        "depth first search",
        "depth first",
        "traversal",
        "traverse",
        "the",
        "a",
        "an",
        "to"
    };

    for(string keyword : intentKeywords)
    {
        size_t pos = query.find(keyword);

        if(pos != string::npos)
        {
            query.erase(pos, keyword.length());
        }
    }

    query.erase(remove(query.begin(), query.end(), '?'), query.end());

    // trim front
    size_t first = query.find_first_not_of(" \t");

    if(first == string::npos)
    {
        return "";
    }

    query.erase(0, first);

    // trim back
    size_t last = query.find_last_not_of(" \t");

    if(last != string::npos)
    {
        query.erase(last + 1);
    }

    return query;
}

// =========================
// FULL NODE RESPONSE
// =========================

string Search::generateFullNodeResponse(Node node)
{
    string response = "";

    response += "\n===== " + node.name + " =====\n\n";

    response += "Definition:\n";
    response += node.definition + "\n\n";

    response += "Category:\n";
    response += node.category + "\n\n";

    if(node.difficulty != "")
    {
        response += "Difficulty:\n";
        response += node.difficulty + "\n\n";
    }

    response += "Operations:\n";

    if(node.operations.empty())
    {
        response += "None\n";
    }
    else
    {
        for(string op : node.operations)
        {
            response += "- " + op + "\n";
        }
    }

    response += "\nTime Complexity:\n";

    if(node.time_complexity.empty())
    {
        response += "None\n";
    }
    else
    {
        for(auto tc : node.time_complexity)
        {
            response += "- " + tc.first + ": " + tc.second + "\n";
        }
    }

    response += "\nReal-Life Examples:\n";

    if(node.real_life_examples.empty())
    {
        response += "None\n";
    }
    else
    {
        for(string example : node.real_life_examples)
        {
            response += "- " + example + "\n";
        }
    }

    response += "\nCode Examples:\n";

    if(node.code_examples.empty())
    {
        response += "None\n";
    }
    else
    {
        for(auto code : node.code_examples)
        {
            response += code.first + ":\n";
            response += code.second + "\n\n";
        }
    }

    response += "\nImages / Diagrams:\n";

    if(node.images.empty())
    {
        response += "None\n";
    }
    else
    {
        for(Image img : node.images)
        {
            response += "- " + img.title + ": " + img.url + "\n";
        }
    }

    response += "\nStep By Step:\n";

    if(node.step_by_step.empty())
    {
        response += "None\n";
    }
    else
    {
        for(string step : node.step_by_step)
        {
            response += "- " + step + "\n";
        }
    }

    response += "\nRelationships:\n";

    if(node.relationships.empty())
    {
        response += "None\n";
    }
    else
    {
        for(Relationship rel : node.relationships)
        {
            response += "- " + rel.target + " (" + rel.type + ")\n";
        }
    }

    return response;
}

// =========================
// GENERATE RESPONSE
// =========================

string Search::generateResponse(string query)
{
    string intent = detectIntent(query);
    string topic = extractTopic(query);

    if(topic.empty())
    {
        return "Please include a topic, for example: time complexity of binary search tree.";
    }

    vector<Node> results = searchByName(topic);

    if(results.empty())
    {
        return "Sorry, this topic cannot be found in the knowledge graph.";
    }

    Node node = results[0];

    if(intent == "bfs")
    {
        vector<string> order = bfsTraversal(node.name);

        if(order.empty())
        {
            return "BFS traversal could not be performed.";
        }

        string response = "BFS traversal starting from " + node.name + ":\n";

        for(string name : order)
        {
            response += "- " + name + "\n";
        }

        return response;
    }

    if(intent == "dfs")
    {
        vector<string> order = dfsTraversal(node.name);

        if(order.empty())
        {
            return "DFS traversal could not be performed.";
        }

        string response = "DFS traversal starting from " + node.name + ":\n";

        for(string name : order)
        {
            response += "- " + name + "\n";
        }

        return response;
    }

    if(intent == "difficulty")
    {
        if(node.difficulty == "")
        {
            return "No difficulty level found for " + node.name + ".";
        }

        return node.name + " difficulty level: " + node.difficulty;
    }

    if(intent == "definition")
    {
        return generateFullNodeResponse(node);
    }

    if(intent == "category")
    {
        return node.name + " belongs to the category: " + node.category;
    }

    if(intent == "operations")
    {
        if(node.operations.empty())
        {
            return "No operations found for " + node.name + ".";
        }

        string response = "Common operations of " + node.name + " are:\n";

        for(string op : node.operations)
        {
            response += "- " + op + "\n";
        }

        return response;
    }

    if(intent == "time_complexity")
    {
        if(node.time_complexity.empty())
        {
            return "No time complexity information found for " + node.name + ".";
        }

        string response = "Time complexities for " + node.name + ":\n";

        for(auto tc : node.time_complexity)
        {
            response += "- " + tc.first + ": " + tc.second + "\n";
        }

        return response;
    }

    if(intent == "related")
    {
        if(node.relationships.empty())
        {
            return "No related topics found for " + node.name + ".";
        }

        string response = "Topics related to " + node.name + " are:\n";

        for(Relationship rel : node.relationships)
        {
            response += "- " + rel.target + " (" + rel.type + ")\n";
        }

        return response;
    }

    if(intent == "code_examples")
    {
        if(node.code_examples.empty())
        {
            return "No code examples found for " + node.name + ".";
        }

        string response = "Code examples for " + node.name + ":\n\n";

        string loweredQuery = toLowerCases(query);

        if(loweredQuery.find("cpp") != string::npos ||
           loweredQuery.find("c++") != string::npos)
        {
            if(node.code_examples.find("cpp") != node.code_examples.end())
            {
                response += "CPP:\n" + node.code_examples["cpp"] + "\n";
                return response;
            }
        }

        if(loweredQuery.find("python") != string::npos)
        {
            if(node.code_examples.find("python") != node.code_examples.end())
            {
                response += "Python:\n" + node.code_examples["python"] + "\n";
                return response;
            }
        }

        if(loweredQuery.find("java") != string::npos)
        {
            if(node.code_examples.find("java") != node.code_examples.end())
            {
                response += "Java:\n" + node.code_examples["java"] + "\n";
                return response;
            }
        }

        for(auto code : node.code_examples)
        {
            response += code.first + ":\n";
            response += code.second + "\n\n";
        }

        return response;
    }

    if(intent == "real_life_examples")
    {
        if(node.real_life_examples.empty())
        {
            return "No real-life examples found for " + node.name + ".";
        }

        string response = "Real-life examples of " + node.name + " are:\n";

        for(string example : node.real_life_examples)
        {
            response += "- " + example + "\n";
        }

        return response;
    }

    if(intent == "math_relations")
    {
        return "Mathematical relations are now displayed in the topic details if available.";
    }

    if(intent == "step_by_step")
    {
        if(node.step_by_step.empty())
        {
            return "No step-by-step explanation found for " + node.name + ".";
        }

        string response = "Step-by-step process for " + node.name + ":\n";

        for(string step : node.step_by_step)
        {
            response += "- " + step + "\n";
        }

        return response;
    }

    if(intent == "images")
    {
        if(node.images.empty())
        {
            return "No images or diagrams found for " + node.name + ".";
        }

        string response = "Images or diagrams available for " + node.name + ":\n";

        for(Image img : node.images)
        {
            response += "- " + img.title + ": " + img.url + "\n";
        }

        return response;
    }

    return generateFullNodeResponse(node);
}