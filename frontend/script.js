let globalData = [];
let cy;

// =========================
// LOAD DATA FROM NODE.JS API
// =========================

fetch("http://localhost:3000/api/dsa")
    .then(response => response.json())
    .then(data => {
        globalData = data;

        console.log("JSON LOADED SUCCESSFULLY");
        console.log(data);

        createGraph(data);
    })
    .catch(error => {
        console.log("ERROR LOADING JSON:");
        console.log(error);
    });


// =========================
// CREATE GRAPH
// =========================

function createGraph(data) {
    const elements = [];

    const nodeNames = new Set(data.map(item => item.name));

    // Create nodes
    data.forEach(item => {
        elements.push({
            data: {
                id: item.name,
                label: item.name
            }
        });
    });

    // Create edges safely
    data.forEach(item => {
        if(item.relationships && item.relationships.length > 0) {
            item.relationships.forEach(rel => {
                if(rel.target && rel.type && nodeNames.has(rel.target)) {
                    elements.push({
                        data: {
                            source: item.name,
                            target: rel.target,
                            label: rel.type
                        }
                    });
                }
                else {
                    console.warn("Skipped missing relationship target:", rel.target);
                }
            });
        }
    });

    cy = cytoscape({
        container: document.getElementById("cy"),

        elements: elements,

        style: [
            {
                selector: "node",
                style: {
                    "shape": "round-rectangle",
                    "width": 130,
                    "height": 45,
                    "padding": "10px",
                    "background-color": "#ffe75d",
                    "label": "data(label)",
                    "color": "#000",
                    "text-valign": "center",
                    "text-halign": "center",
                    "font-size": "12px",
                    "text-wrap": "wrap",
                    "text-max-width": "120px"
                }
            },
            {
                selector: "edge",
                style: {
                    "width": 2,
                    "line-color": "#9ca3af",
                    "target-arrow-color": "#9ca3af",
                    "target-arrow-shape": "triangle",
                    "curve-style": "bezier",
                    "label": "data(label)",
                    "font-size": "8px",
                    "text-background-color": "white",
                    "text-background-opacity": 1,
                    "text-background-padding": "2px"
                }
            },
            {
                selector: ".highlight",
                style: {
                    "background-color": "#ff2b2b",
                    "color": "#fff"
                }
            }
        ],

        layout: {
            name: "cose",
            idealEdgeLength: 130,
            nodeRepulsion: 500000,
            edgeElasticity: 100,
            gravity: 20,
            animate: true
        }
    });

    cy.on("tap", "node", function(event) {
        const nodeName = event.target.id();
        const nodeData = findNode(nodeName);

        if(nodeData) {
            highlightNode(nodeName);
            displayNodeInfo(nodeData);
        }
    });
}


// =========================
// FIND NODE
// =========================

function findNode(name) {
    return globalData.find(item =>
        item.name.toLowerCase() === name.toLowerCase()
    );
}


// =========================
// DISPLAY NODE INFO
// =========================

function displayNodeInfo(nodeData) {
    const resultBox = document.getElementById("resultBox");

    resultBox.innerHTML = `
        <h2>${nodeData.name}</h2>

        ${nodeData.difficulty ? `
            <p><strong>Difficulty:</strong> ${nodeData.difficulty}</p>
        ` : ""}

        <p><strong>Category:</strong> ${nodeData.category || "N/A"}</p>

        <p><strong>Definition:</strong> ${nodeData.definition || "No definition available."}</p>

        ${renderListSection("Operations", nodeData.operations)}

        ${renderComplexity(nodeData.time_complexity)}

        ${renderListSection("Real Life Examples", nodeData.real_life_examples)}

        ${renderInterviewQuestions(nodeData.interview_questions)}

        ${renderCodeExamples(nodeData.code_examples)}

        ${renderImages(nodeData.images)}

        ${renderListSection("Step By Step", nodeData.step_by_step)}

        ${renderRelationships(nodeData.relationships)}
    `;
}


// =========================
// RENDER HELPERS
// =========================

function renderListSection(title, list) {
    if(!list || list.length === 0) {
        return "";
    }

    return `
        <h3>${title}</h3>
        <ul>
            ${list.map(item => `<li>${item}</li>`).join("")}
        </ul>
    `;
}


function renderRelationships(relationships) {
    if(!relationships || relationships.length === 0) {
        return "";
    }

    return `
        <h3>Relationships</h3>
        <ul>
            ${relationships.map(rel => `
                <li>${rel.type} → ${rel.target}</li>
            `).join("")}
        </ul>
    `;
}


function renderComplexity(timeComplexity) {
    if(!timeComplexity || Object.keys(timeComplexity).length === 0) {
        return "";
    }

    return `
        <h3>Time Complexity</h3>
        <table class="complexity-table">
            <tr>
                <th>Operation</th>
                <th>Complexity</th>
            </tr>
            ${Object.entries(timeComplexity).map(([key, value]) => `
                <tr>
                    <td>${key}</td>
                    <td>${value}</td>
                </tr>
            `).join("")}
        </table>
    `;
}


function renderInterviewQuestions(questions) {
    if(!questions || questions.length === 0) {
        return "";
    }

    return `
        <h3>Interview Questions</h3>
        ${questions.map(q => `
            <div class="question-card">
                <p><strong>Q:</strong> ${q.question}</p>
                <p><strong>A:</strong> ${q.answer}</p>
            </div>
        `).join("")}
    `;
}


function renderCodeExamples(codeExamples) {
    if(!codeExamples || Object.keys(codeExamples).length === 0) {
        return "";
    }

    return `
        <h3>Code Examples</h3>

        ${Object.entries(codeExamples).map(([language, code]) => `
            <h4>${language.toUpperCase()}</h4>
            <pre class="code-block">${code}</pre>
        `).join("")}
    `;
}


function renderImages(images) {
    if(!images || images.length === 0) {
        return "";
    }

    return `
        <h3>Images / Diagrams</h3>

        ${images.map(img => `
            <div class="image-card">
                <p><strong>${img.title}</strong></p>
                <img src="${img.url}" alt="${img.title}" class="topic-image">
            </div>
        `).join("")}
    `;
}


// =========================
// HIGHLIGHT NODE
// =========================

function highlightNode(nodeName) {
    cy.elements().removeClass("highlight");

    const node = cy.getElementById(nodeName);

    if(node && node.length > 0) {
        node.addClass("highlight");

        cy.animate({
            fit: {
                eles: node,
                padding: 120
            }
        }, {
            duration: 500
        });
    }
}


// =========================
// SEARCH
// =========================

/*function searchTopic() {
    const input = document.getElementById("searchInput").value.trim();
    const resultBox = document.getElementById("resultBox");

    if(!input) {
        resultBox.innerHTML = "<p>Please enter a search question.</p>";
        return;
    }

    fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(input)}`)
        .then(response => response.json())
        .then(searchResult => {
            console.log("SEARCH RESULT:", searchResult);

            const nodeData = findBestNodeMatch(input);

            if(!nodeData) {
                resultBox.innerHTML = `
                    <h2>Topic Not Found</h2>
                    <p>${searchResult.answer || "No matching topic found."}</p>
                `;
                return;
            }

            highlightNode(nodeData.name);

            // If backend search returns an answer, show it first
            resultBox.innerHTML = `
                <h2>${nodeData.name}</h2>

                ${searchResult.answer ? `
                    <div class="answer-box">
                        <h3>Search Answer</h3>
                        <p>${searchResult.answer.replace(/\n/g, "<br>")}</p>
                    </div>
                ` : ""}

                ${nodeData.difficulty ? `
                    <p><strong>Difficulty:</strong> ${nodeData.difficulty}</p>
                ` : ""}

                <p><strong>Category:</strong> ${nodeData.category || "N/A"}</p>

                <p><strong>Definition:</strong> ${nodeData.definition || "No definition available."}</p>

                ${renderListSection("Operations", nodeData.operations)}

                ${renderComplexity(nodeData.time_complexity)}

                ${renderListSection("Real Life Examples", nodeData.real_life_examples)}

                ${renderInterviewQuestions(nodeData.interview_questions)}

                ${renderCodeExamples(nodeData.code_examples)}

                ${renderImages(nodeData.images)}

                ${renderListSection("Step By Step", nodeData.step_by_step)}

                ${renderRelationships(nodeData.relationships)}
            `;
        })
        .catch(error => {
            console.log("Search error:", error);
            resultBox.innerHTML = "<p>Search failed. Check Node.js backend.</p>";
        });
}*/

function searchTopic() {
    console.log("SEARCH BUTTON WORKS");

    const resultBox = document.getElementById("resultBox");

    resultBox.innerHTML = `
        <h2>Search Test</h2>
        <p>If this stays on screen, the reload problem is not the button.</p>
    `;
}


function findBestNodeMatch(input) {
    const cleanedInput = input
        .toLowerCase()
        .replace("what is", "")
        .replace("define", "")
        .replace("definition of", "")
        .replace("operations of", "")
        .replace("time complexity of", "")
        .replace("code example of", "")
        .replace("interview questions of", "")
        .replace("step by step of", "")
        .replace("diagram of", "")
        .replace("image of", "")
        .replace("?", "")
        .trim();

    let exactMatch = globalData.find(item =>
        item.name.toLowerCase() === cleanedInput
    );

    if(exactMatch) {
        return exactMatch;
    }

    let partialMatch = globalData.find(item =>
        item.name.toLowerCase().includes(cleanedInput) ||
        cleanedInput.includes(item.name.toLowerCase())
    );

    return partialMatch;
}


// =========================
// EVENT LISTENERS
// =========================

document.getElementById("searchButton").addEventListener("click", function(event) {
    event.preventDefault();
    searchTopic();
});

document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if(event.key === "Enter") {
        event.preventDefault();
        searchTopic();
    }
});