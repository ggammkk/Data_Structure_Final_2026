
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
                name: 'cose',
                idealEdgeLength: 100,
                nodeRepulsion: 4000000,
                edgeElasticity: 100,
                gravity: 80,
                animate: true,

                fit: true,
                padding: 50
            }
        });

        cy.ready(() => {
            if (window.innerWidth > 1600) {
                cy.zoom(0.6);
            }
            else if (window.innerWidth > 1200) {
                cy.zoom(0.75);
            }
            else {
                cy.zoom(0.9);
            }
            cy.center();
        });

        console.log("GRAPH CREATED SUCCESSFULLY");

        cy.on('tap', 'node', function (evt) {
            const node = evt.target;

            // remove previous highlight
            cy.elements().removeClass("highlight");

    const node = cy.getElementById(nodeName);

    if(node && node.length > 0) {
        node.addClass("highlight");

            // zoom + center properly
            cy.animate({
                fit: {
                    eles: node,
                    padding: 120
                },
                duration: 600
            });

            const nodeName = node.id();

            console.log("CLICKED:");
            console.log(nodeName);

            const nodeData = findNode(data, nodeName);
            const resultBox = document.getElementById('resultBox');

            if (nodeData) {
                let complexityHTML = "";
                for (const key in nodeData.time_complexity) { complexityHTML += `<li>${key}: ${nodeData.time_complexity[key]}</li>`; }
                resultBox.innerHTML = `

                <h2>${nodeData.name}</h2>

                <p>
                    <strong>Definition:</strong>
                    ${nodeData.definition}
                </p>
                <p>
                    <strong>Category:</strong>
                    ${nodeData.category}
                </p>
                ${nodeData.operations && nodeData.operations.length > 0 ? `
                    <p><strong>Operations:</strong></p>
                    <ul>
                        ${nodeData.operations.map(op => `<li>${op}</li>`).join("")}
                    </ul>
                ` : ""}

                ${(nodeData.code_examples?.cpp || nodeData.code_examples)?.length ? `
                    <p><strong>Code Examples:</strong></p>
                    <pre class="code-block">${(nodeData.code_examples?.cpp || nodeData.code_examples).join("\n")}</pre>
                ` : ""}
                
                ${nodeData.real_life_examples && nodeData.real_life_examples.length > 0 ? `
                    <p><strong>Real Life Examples:</strong></p>
                    <p>${nodeData.real_life_examples.join(", ")}</p>
                ` : ""}

                ${nodeData.math_relations?.length ? `
                    <p><strong>Math Relations:</strong></p>
                    <ul>
                        ${nodeData.math_relations
                            .map(math => `<li>${math}</li>`)
                            .join("")}
                    </ul>
                ` : ""}

                ${nodeData.time_complexity && Object.keys(nodeData.time_complexity).length > 0 ? `
                    <p><strong>Time Complexity:</strong></p>
                    <ul>
                        ${Object.entries(nodeData.time_complexity)
                            .map(([key, value]) => `<li>${key}: ${value}</li>`)
                            .join("")}
                    </ul>
                ` : ""}
                `;
            }

        });

    })

    // ERROR HANDLING
    .catch(error => {
        console.log("ERROR LOADING JSON:");
        console.log(error);
    });

//globalData = data;

function searchTopic() {
    const input = document.getElementById("searchInput").value.trim();

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

            const node = window.cy.getElementById(nodeData.name);

            if (node && node.length > 0) {

                // remove previous highlights
                window.cy.elements().removeClass("highlight");

                // highlight current node
                node.addClass("highlight");

                // animate zoom
                window.cy.animate({
                    fit: {
                        eles: node,
                        padding: 120
                    },
                    zoom: 1.2,
                    duration: 700
                });
            }

            resultBox.innerHTML = `
                <h2>${nodeData.name}</h2>

                <p>
                    <strong>Definition:</strong>
                    ${nodeData.definition}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${nodeData.category}
                </p>

                ${nodeData.operations?.length ? `
                    <p><strong>Operations:</strong></p>
                    <ul>
                        ${nodeData.operations.map(op => `<li>${op}</li>`).join("")}
                    </ul>
                ` : ""}

                ${(nodeData.code_examples?.cpp || nodeData.code_examples)?.length ? `
                    <p><strong>Code Examples:</strong></p>
                    <pre class="code-block">${(nodeData.code_examples?.cpp || nodeData.code_examples).join("\n")}</pre>
                ` : ""}
 
               ${nodeData.real_life_examples && nodeData.real_life_examples.length > 0 ? `
                    <p><strong>Real Life Examples:</strong></p>
                    <p>${nodeData.real_life_examples.join(", ")}</p>
                ` : ""}

                ${nodeData.math_relations?.length ? `
                    <p><strong>Math Relations:</strong></p>
                    <ul>
                        ${nodeData.math_relations
                        .map(math => `<li>${math}</li>`)
                        .join("")}
                    </ul>
                ` : ""}

               ${nodeData.time_complexity && Object.keys(nodeData.time_complexity).length > 0 ? `
                    <p><strong>Time Complexity:</strong></p>
                    <ul>
                        ${Object.entries(nodeData.time_complexity)
                        .map(([key, value]) => `<li>${key}: ${value}</li>`)
                        .join("")}
                    </ul>
                ` : ""}
            `;
        })
        .catch(error => {
            console.log("Search error:", error);
            resultBox.innerHTML = "<p>Search failed. Check Node.js backend.</p>";
        });
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