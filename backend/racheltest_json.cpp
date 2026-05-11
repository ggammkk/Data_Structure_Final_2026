#include <iostream>
#include <fstream>

#include "json.hpp"

using json = nlohmann::json;
using namespace std;

int main()
{

    ifstream file("../data/racheltemp.json");

    if (!file)
    {
        cout << "File not found!" << endl;
        return 1;
    }

    json data;
    file >> data;

    for (auto item : data)
    {
        cout << "========================" << endl;

        cout << "Name: " << item["name"].get<string>() << endl;
        cout << "Definition: " << item["definition"].get<string>() << endl;
        cout << "Category: " << item["category"].get<string>() << endl;

        // Operations
        cout << "\nOperations:" << endl;
        for (auto &op : item["operations"])
        {
            q
                    cout
                << "- " << op.get<string>() << endl;
        }

        // Relationships
        cout << "\nRelationships:" << endl;

        for (auto &rel : item["relationships"])
        {
            string type = rel["type"].get<string>();
            string target = rel["target"].get<string>();

            cout << "- ";

            if (type == "is_a")
            {
                cout << "is a ";
            }
            else if (type == "uses")
            {
                cout << "uses ";
            }
            else if (type == "parent_of")
            {
                cout << "parent of ";
            }
            else if (type == "child_of")
            {
                cout << "child of ";
            }
            else if (type == "used_in")
            {
                cout << "used in ";
            }
            else
            {
                cout << type << " ";
            }

            cout << target << endl;
        }

        // Code Examples
        cout << "\nCode Examples:" << endl;

        if (!item["code_examples"].empty())
        {
            for (auto line : item["code_examples"]["cpp"])
            {
                cout << line.get<string>() << endl;
            }
        }
        else
        {
            cout << "None" << endl;
        }

        // Real Life Examples
        cout << "\nReal Life Examples:" << endl;
        for (auto &ex : item["real_life_examples"])
        {
            cout << "- " << ex.get<string>() << endl;
        }

        // Math Relations
        cout << "\nMath Relations:" << endl;
        for (auto &math : item["math_relations"])
        {
            cout << "- " << math.get<string>() << endl;
        }

        // Time Complexity
        cout << "\nTime Complexity:" << endl;

        if (item["time_complexity"].empty())
        {
            cout << "None" << endl;
        }
        else
        {
            for (auto &[key, value] : item["time_complexity"].items())
            {
                cout << key << ": " << value << endl;
            }
        }

        cout << endl;
    }

    return 0;
}