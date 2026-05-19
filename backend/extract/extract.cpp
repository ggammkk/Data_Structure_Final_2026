#include "extract.h"

#include <iostream>
#include <fstream> //read and write files
#include <sstream> // sream string

using namespace std;

// MAIN CONVERT FUNCTION
// read txt file, split into blocks, parse each block, write JSON file

bool Extractor::convertTxtToJson(string inputPath, string outputPath)
{
    ifstream inputFile(inputPath);

    if(!inputFile) // check if fail to open
    {
        cout << "Failed to open input text file.\n";
        return false;
    }

    stringstream buffer; // temporarily store the whole content of the TXT file.
    buffer << inputFile.rdbuf(); // read and put in buffer

    string text = buffer.str(); // convert to string

    vector<string> blocks = splitBlocks(text); // split the text into topic blocks based on separator lines
    cout << "Found " << blocks.size() << " topic blocks.\n";

    vector<ExtractNode> nodes; // create vector to store

    for(string block : blocks) // loop all node
    {
        ExtractNode node = parseBlock(block); // 1 topic = 1 obj.

        if(node.name != "") // only save if have topic name
        {
            nodes.push_back(node);
        }
    }

    writeJson(nodes, outputPath); // write all in json file

    cout << "Saved " << nodes.size()
         << " nodes to "
         << outputPath
         << endl;

    return true;
}

// SPLIT TXT INTO TOPIC BLOCKS

vector<string> Extractor::splitBlocks(string text)
{
    vector<string> blocks;

    string separator = "=================================================="; //seperator

    size_t start = 0;
    size_t end;

    // Keep finding separator lines until there are no more separators.
    while((end = text.find(separator, start)) != string::npos)
    {
        string block = text.substr(start, end - start);

        block = trim(block); // remove extarcspace

        if(block != "") // save if not empty
        {
            blocks.push_back(block);
        }

        start = end + separator.length();//move to start after seperator
    }

    // After the loop, there may still be one last block after the final separator.
    string lastBlock = text.substr(start);
    lastBlock = trim(lastBlock);

    if(lastBlock != "")
    {
        blocks.push_back(lastBlock);
    }

    return blocks;
}

// =========================
// PARSE ONE TOPIC BLOCK
// =========================

ExtractNode Extractor::parseBlock(string block)
{
    ExtractNode node;

    vector<string> definitionLines;
    vector<string> operationLines;
    vector<string> relationshipLines;
    vector<string> timeLines;
    vector<string> realLifeLines;
    vector<string> imageLines;
    vector<string> stepLines;
    vector<string> mathLines;
    vector<string> cppCodeLines;

    string currentSection = "";

    stringstream ss(block);
    string line;

    while(getline(ss, line))
    {
        line = trim(line);

        if(line.rfind("Topic:", 0) == 0)
        {
            node.name = trim(line.substr(6));
        }

        else if(line.rfind("Category:", 0) == 0)
        {
            node.category = trim(line.substr(9));
        }

        else if(line.rfind("Difficulty:", 0) == 0)
        {
            node.difficulty = trim(line.substr(11));
        }

        else if(line == "Definition:")
        {
            currentSection = "definition";
        }

        else if(line == "Operations:")
        {
            currentSection = "operations";
        }

        else if(line == "Relationships:")
        {
            currentSection = "relationships";
        }

        else if(line == "Time Complexity:")
        {
            currentSection = "time";
        }

        else if(line == "Real Life Examples:")
        {
            currentSection = "real_life";
        }

        else if(line == "CPP Code:")
        {
            currentSection = "cpp_code";
        }

        else if(line == "Math Relations:")
        {
            currentSection = "math";
        }

        else if(line == "Images:")
        {
            currentSection = "images";
        }

        else if(line == "Step By Step:")
        {
            currentSection = "step_by_step";
        }

        else
        {
            if(currentSection == "definition")
            {
                definitionLines.push_back(line);
            }

            else if(currentSection == "operations")
            {
                operationLines.push_back(line);
            }

            else if(currentSection == "relationships")
            {
                relationshipLines.push_back(line);
            }

            else if(currentSection == "time")
            {
                timeLines.push_back(line);
            }

            else if(currentSection == "real_life")
            {
                realLifeLines.push_back(line);
            }

            else if(currentSection == "cpp_code")
            {
                cppCodeLines.push_back(line);
            }

            else if(currentSection == "math")
            {
                mathLines.push_back(line);
            }

            else if(currentSection == "images")
            {
                imageLines.push_back(line);
            }

            else if(currentSection == "step_by_step")
            {
                stepLines.push_back(line);
            }
        }
    }

    // Definition
    for(string defLine : definitionLines)
    {
        if(defLine != "")
        {
            if(node.definition != "")
            {
                node.definition += " ";
            }

            node.definition += defLine;
        }
    }

    node.operations = parseList(operationLines);
    node.relationships = parseRelationships(relationshipLines);
    node.time_complexity = parseTimeComplexity(timeLines);
    node.real_life_examples = parseList(realLifeLines);
    node.math_relations = parseList(mathLines);
    node.images = parseImages(imageLines);
    node.step_by_step = parseList(stepLines);

    string cppCode = joinCodeLines(cppCodeLines);

    if(cppCode != "")
    {
        node.code_examples["cpp"] = cppCode;
    }
    return node;
}

// =========================
// PARSE NORMAL LIST
// =========================

vector<string> Extractor::parseList(vector<string> lines)
{
    vector<string> items;

    for(string line : lines)
    {
        line = trim(line);

        if(line.rfind("- ", 0) == 0)
        {
            string item = trim(line.substr(2));

            if(item != "" && item != "None" && item != "none")
            {
                items.push_back(item);
            }
        }

        else if(line != "" && line != "None" && line != "none")
        {
            items.push_back(line);
        }
    }

    return items;
}

// =========================
// PARSE RELATIONSHIPS
// Format: - is_a -> Tree
// =========================

vector<ExtractRelationship> Extractor::parseRelationships(vector<string> lines)
{
    vector<ExtractRelationship> relationships;

    for(string line : lines)
    {
        line = trim(line);

        if(line.rfind("- ", 0) == 0)
        {
            line = trim(line.substr(2));
        }

        if(line == "" || line == "None" || line == "none")
        {
            continue;
        }

        size_t arrowPos = line.find("->");

        if(arrowPos != string::npos)
        {
            ExtractRelationship rel;

            rel.type = trim(line.substr(0, arrowPos));
            rel.target = trim(line.substr(arrowPos + 2));

            relationships.push_back(rel);
        }
    }

    return relationships;
}

// =========================
// PARSE TIME COMPLEXITY
// Format: - Search: O(log n)
// =========================

map<string, string> Extractor::parseTimeComplexity(vector<string> lines)
{
    map<string, string> complexity;

    for(string line : lines)
    {
        line = trim(line);

        if(line.rfind("- ", 0) == 0)
        {
            line = trim(line.substr(2));
        }

        if(line == "" || line == "None" || line == "none")
        {
            continue;
        }

        size_t colonPos = line.find(":");

        if(colonPos != string::npos)
        {
            string operation = trim(line.substr(0, colonPos));
            string value = trim(line.substr(colonPos + 1));

            complexity[operation] = value;
        }
    }

    return complexity;
}

// =========================
// PARSE IMAGES
// Format: - BST Insertion -> images/bst_insert.png
// =========================

vector<ExtractImage> Extractor::parseImages(vector<string> lines)
{
    vector<ExtractImage> images;

    for(string line : lines)
    {
        line = trim(line);

        if(line.rfind("- ", 0) == 0)
        {
            line = trim(line.substr(2));
        }

        if(line == "" || line == "None" || line == "none")
        {
            continue;
        }

        size_t arrowPos = line.find("->");

        if(arrowPos != string::npos)
        {
            ExtractImage img;

            img.title = trim(line.substr(0, arrowPos));
            img.url = trim(line.substr(arrowPos + 2));

            images.push_back(img);
        }
    }

    return images;
}

// =========================
// JOIN CODE LINES
// =========================

string Extractor::joinCodeLines(vector<string> lines)
{
    string code = "";

    for(string line : lines)
    {
        if(code != "")
        {
            code += "\n";
        }

        code += line;
    }

    return code;
}

// =========================
// WRITE JSON FILE
// =========================

void Extractor::writeJson(vector<ExtractNode> nodes, string outputPath)
{
    ofstream outputFile(outputPath);

    if(!outputFile)
    {
        cout << "Failed to open output JSON file.\n";
        return;
    }

    outputFile << "[\n";

    for(size_t i = 0; i < nodes.size(); i++)
    {
        ExtractNode node = nodes[i];

        outputFile << "    {\n";

        outputFile << "        \"name\": \"" << escapeJson(node.name) << "\",\n";
        outputFile << "        \"definition\": \"" << escapeJson(node.definition) << "\",\n";
        outputFile << "        \"category\": \"" << escapeJson(node.category) << "\",\n";
        outputFile << "        \"difficulty\": \"" << escapeJson(node.difficulty) << "\",\n";

        // operations
        outputFile << "        \"operations\": [\n";

        for(size_t j = 0; j < node.operations.size(); j++)
        {
            outputFile << "            \"" << escapeJson(node.operations[j]) << "\"";

            if(j + 1 < node.operations.size())
            {
                outputFile << ",";
            }

            outputFile << "\n";
        }

        outputFile << "        ],\n";

        // relationships
        outputFile << "        \"relationships\": [\n";

        for(size_t j = 0; j < node.relationships.size(); j++)
        {
            outputFile << "            {\n";

            outputFile << "                \"target\": \""
                       << escapeJson(node.relationships[j].target)
                       << "\",\n";

            outputFile << "                \"type\": \""
                       << escapeJson(node.relationships[j].type)
                       << "\"\n";

            outputFile << "            }";

            if(j + 1 < node.relationships.size())
            {
                outputFile << ",";
            }

            outputFile << "\n";
        }

        outputFile << "        ],\n";

        // time complexity
        outputFile << "        \"time_complexity\": {\n";

        size_t timeCount = 0;

        for(auto tc : node.time_complexity)
        {
            outputFile << "            \""
                       << escapeJson(tc.first)
                       << "\": \""
                       << escapeJson(tc.second)
                       << "\"";

            timeCount++;

            if(timeCount < node.time_complexity.size())
            {
                outputFile << ",";
            }

            outputFile << "\n";
        }

        outputFile << "        },\n";

        // real life examples
        outputFile << "        \"real_life_examples\": [\n";

        for(size_t j = 0; j < node.real_life_examples.size(); j++)
        {
            outputFile << "            \""
                       << escapeJson(node.real_life_examples[j])
                       << "\"";

            if(j + 1 < node.real_life_examples.size())
            {
                outputFile << ",";
            }

            outputFile << "\n";
        }

        outputFile << "        ],\n";


                // math relations
        outputFile << "        \"math_relations\": [\n";

        for(size_t j = 0; j < node.math_relations.size(); j++)
        {
            outputFile << "            \""
                       << escapeJson(node.math_relations[j])
                       << "\"";

            if(j + 1 < node.math_relations.size())
            {
                outputFile << ",";
            }

            outputFile << "\n";
        }

        outputFile << "        ],\n";

        // code examples object
        outputFile << "        \"code_examples\": {\n";

        size_t codeCount = 0;

        for(auto code : node.code_examples)
        {
            outputFile << "            \""
                       << escapeJson(code.first)
                       << "\": \""
                       << escapeJson(code.second)
                       << "\"";

            codeCount++;

            if(codeCount < node.code_examples.size())
            {
                outputFile << ",";
            }

            outputFile << "\n";
        }

        outputFile << "        },\n";

        // images
        outputFile << "        \"images\": [\n";

        for(size_t j = 0; j < node.images.size(); j++)
        {
            outputFile << "            {\n";

            outputFile << "                \"title\": \""
                       << escapeJson(node.images[j].title)
                       << "\",\n";

            outputFile << "                \"url\": \""
                       << escapeJson(node.images[j].url)
                       << "\"\n";

            outputFile << "            }";

            if(j + 1 < node.images.size())
            {
                outputFile << ",";
            }

            outputFile << "\n";
        }

        outputFile << "        ],\n";

        // step by step
        outputFile << "        \"step_by_step\": [\n";

        for(size_t j = 0; j < node.step_by_step.size(); j++)
        {
            outputFile << "            \""
                       << escapeJson(node.step_by_step[j])
                       << "\"";

            if(j + 1 < node.step_by_step.size())
            {
                outputFile << ",";
            }

            outputFile << "\n";
        }

        outputFile << "        ]\n";

        outputFile << "    }";

        if(i + 1 < nodes.size())
        {
            outputFile << ",";
        }

        outputFile << "\n";
    }

    outputFile << "]\n";
}

// =========================
// TRIM WHITESPACE
// =========================

string Extractor::trim(string text)
{
    size_t start = text.find_first_not_of(" \t\r\n");

    if(start == string::npos)
    {
        return "";
    }

    size_t end = text.find_last_not_of(" \t\r\n");

    return text.substr(start, end - start + 1);
}

// =========================
// ESCAPE SPECIAL JSON CHARACTERS
// =========================

string Extractor::escapeJson(string text)
{
    string result;

    for(char c : text)
    {
        if(c == '"')
        {
            result += "\\\"";
        }

        else if(c == '\\')
        {
            result += "\\\\";
        }

        else if(c == '\n')
        {
            result += "\\n";
        }

        else if(c == '\r')
        {
            result += "\\r";
        }

        else if(c == '\t')
        {
            result += "\\t";
        }

        else
        {
            result += c;
        }
    }

    return result;
}
/*
#include "extract.h"

int main()
{
    Extractor extractor;

    extractor.convertTxtToJson(
        "../data/dsa_llm_source_cpp_math_no_interview.txt",
        "../data/dsa_nodes.json"
    );

    return 0;
}*/