#ifndef EXTRACT_H
#define EXTRACT_H

#include <string>
#include <vector>
#include <map>

using namespace std;

struct ExtractRelationship
{
    string target;
    string type;
};

struct ExtractImage
{
    string title;
    string url;
};

struct ExtractNode
{
    string name;
    string definition;
    string category;
    string difficulty;

    vector<string> operations;
    vector<ExtractRelationship> relationships;

    map<string, string> time_complexity;

    vector<string> real_life_examples;
    vector<string> math_relations;

    map<string, string> code_examples;

    vector<ExtractImage> images;
    vector<string> step_by_step;
};

class Extractor
{
public:
    bool convertTxtToJson(string inputPath, string outputPath);

private:
    vector<string> splitBlocks(string text);
    ExtractNode parseBlock(string block);

    string trim(string text);
    string escapeJson(string text);

    vector<string> parseList(vector<string> lines);
    vector<ExtractRelationship> parseRelationships(vector<string> lines);
    map<string, string> parseTimeComplexity(vector<string> lines);
    vector<ExtractImage> parseImages(vector<string> lines);

    string joinCodeLines(vector<string> lines);

    void writeJson(vector<ExtractNode> nodes, string outputPath);
};

#endif