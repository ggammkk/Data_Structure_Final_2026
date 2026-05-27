# Data Structures Final Project README

# DSA Knowledge Graph System

## Project Overview

The DSA Knowledge Graph System is an interactive educational platform designed to help students learn Data Structures and Algorithms visually and interactively.

The system represents DSA concepts as graph nodes and relationships as graph edges. Users can:
- explore DSA relationships visually
- search DSA topics dynamically
- view definitions and code examples
- practice problems
- answer quizzes
- prepare for interviews

The project combines:
- C++
- Node.js
- Express.js
- HTML/CSS/JavaScript
- Cytoscape.js

---

# System Architecture

TXT Educational Data  
↓  
C++ Extractor System  
↓  
JSON Knowledge Database  
↓  
Node.js Backend API  
↓  
Frontend Visualization System  

---

# Features

- Interactive DSA knowledge graph
- Search system using C++
- BFS and DFS traversal
- Quiz system
- Practice problem system
- Interview preparation page
- Dynamic node highlighting
- Code examples
- Relationship visualization
- Image support
- Step-by-step explanations

---

# Folder Structure

```text
Data_Structure_Final_2026/
│
├── data/
│   ├── dsa_llm_source.txt
│   ├── dsa_nodes.json
│   ├── quiz.json
│   ├── practice.json
│   └── interview.json
│
├── backend/
│   │
│   ├── server.js
│   │
│   ├── graph.h
│   ├── graph.cpp
│   ├── search.h
│   ├── search.cpp
│   ├── main.cpp
│   ├── search_program.exe
│   │
│   ├── extract.h
│   ├── extract.cpp
│   ├── extract_main.cpp
│   ├── extract_program.exe
│   │
│   ├── quiz/
│   │   ├── quiz.h
│   │   ├── quiz.cpp
│   │   ├── quiz_main.cpp
│   │   └── quiz_program.exe
│   │
│   ├── practice/
│   │   ├── practice.h
│   │   ├── practice.cpp
│   │   ├── practice_main.cpp
│   │   └── practice_program.exe
│   │
│   └── interview/
│       ├── interview.h
│       ├── interview.cpp
│       ├── interview_main.cpp
│       └── interview_program.exe
│
└── frontend/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── images/
    ├── navbar/
    └── other frontend pages
```

---

# Requirements

Install:

1. Node.js  
2. MinGW g++ compiler  

Download:

- https://nodejs.org
- https://www.mingw-w64.org/

Recommended:
- Node.js v18+
- VS Code Live Server Extension

---

# Installation

Open terminal inside:

```bash
backend
```

Install Node.js dependencies:

```bash
npm install
```

This installs:
- express
- cors

---

# Compile Main Search System

Open terminal inside:

```bash
backend
```

Compile:

```bash
g++ -std=c++17 main.cpp graph.cpp search.cpp -static -static-libgcc -static-libstdc++ -o search_program.exe
```

This program handles:
- graph creation
- DSA searching
- BFS traversal
- DFS traversal
- response generation

---

# Compile Extractor System (Optional)

If new DSA topics are added into:

```text
data/dsa_llm_source.txt
```

compile extractor:

```bash
g++ -std=c++17 extract_main.cpp extract.cpp -static -static-libgcc -static-libstdc++ -o extract_program.exe
```

Run extractor:

```bash
./extract_program.exe
```

This regenerates:

```text
data/dsa_nodes.json
```

---

# Compile Quiz System

Open terminal:

```bash
cd backend/quiz
```

Compile:

```bash
g++ -std=c++17 quiz_main.cpp quiz.cpp -static -static-libgcc -static-libstdc++ -o quiz_program.exe
```

---

# Compile Practice System

Open terminal:

```bash
cd backend/practice
```

Compile:

```bash
g++ -std=c++17 practice_main.cpp practice.cpp -static -static-libgcc -static-libstdc++ -o practice_program.exe
```

---

# Compile Interview System

Open terminal:

```bash
cd backend/interview
```

Compile:

```bash
g++ -std=c++17 interview_main.cpp interview.cpp -static -static-libgcc -static-libstdc++ -o interview_program.exe
```

---

# Run Backend Server

Open terminal:

```bash
cd backend
```

Run:

```bash
node server.js
```

Expected output:

```text
Server running on port 3000
```

The backend API now connects:
- frontend
- JSON database
- C++ search system

---

# Open Frontend

Open:

```text
frontend/index.html
```

Recommended:

Use VS Code Live Server.

Steps:
1. Right click `index.html`
2. Select `Open with Live Server`

Default address:

```text
http://127.0.0.1:5500
```

---

# Search System Flow

Frontend Search  
↓  
Node.js API  
↓  
C++ Search Program  
↓  
Graph Search  
↓  
Response Returned  
↓  
Frontend Rendering  

---

# How To Add New DSA Topics

1. Open:

```text
data/dsa_llm_source.txt
```

2. Add a new topic block using the correct format.

3. Run the extractor program again.

4. Restart backend server.

5. Refresh frontend.

---

# Common Problems

## 1. Search does not work

Verify backend is running:

```bash
node server.js
```

Verify:
- `search_program.exe` exists
- frontend fetch uses port 3000

---

## 2. Quiz returns empty []

Recompile:

```bash
g++ -std=c++17 quiz_main.cpp quiz.cpp -o quiz_program.exe
```

---

## 3. Cannot GET page

Check HTML paths.

Correct example:

```html
<script src="interview.js"></script>
```

Avoid incorrect paths:

```html
<script src="../interview/interview.js"></script>
```

---

## 4. Code execution fails

Verify MinGW is installed:

```bash
g++ --version
```

---

## 5. Graph does not render

Check:
- JSON format is valid
- relationships target existing nodes
- Cytoscape.js loaded correctly

---

## 6. Images do not display

Check:
- image files exist
- image paths are correct
- images folder matches JSON paths

---

## 7. Page reloads continuously

Possible causes:
- Live Server auto reload
- missing image files
- incorrect fetch API port
- JavaScript runtime errors

Check:
- browser console
- Node.js server status
- image paths
- Cytoscape rendering

---

# Technologies Used

| Technology | Purpose |
|---|---|
| C++ | Graph and search logic |
| Node.js | Backend API |
| Express.js | Server routing |
| JSON | Data storage |
| HTML/CSS/JavaScript | Frontend |
| Cytoscape.js | Graph visualization |

---

# Authors

Rachel Felicia Winata Goh  
Khongkwan Leksomboon  
Alinane Agness Kamanga  

Data Structures Final Project 2026