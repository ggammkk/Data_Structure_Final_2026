#include <iostream>
#include <fstream>

#include "json.hpp"

using json = nlohmann::json;
using namespace std;

int main()
{

    ifstream file("C:\\Users\\User\\OneDrive\\Desktop\\class 2025\\data structure\\Final Project\\data\\gamtemp.json");

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

        cout << "Name: " << item["name"] << endl;
        cout << "Definition: " << item["definition"] << endl;
        cout << "Category: " << item["category"] << endl;

        // Operations
        cout << "\nOperations:" << endl;
        for (auto op : item["operations"])
        {
            cout << "- " << op << endl;
        }

        // Relationships
        cout << "\nRelationships:" << endl;
        for (auto rel : item["relationships"])
        {
            cout << "- " << rel << endl;
        }

        // Code Examples
        cout << "\nCode Examples:" << endl;
        for (auto code : item["code_examples"])
        {
            cout << "- " << code << endl;
        }

        // Real Life Examples
        cout << "\nReal Life Examples:" << endl;
        for (auto ex : item["real_life_examples"])
        {
            cout << "- " << ex << endl;
        }

        // Math Relations
        cout << "\nMath Relations:" << endl;
        for (auto math : item["math_relations"])
        {
            cout << "- " << math << endl;
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