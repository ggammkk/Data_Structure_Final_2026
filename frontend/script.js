let globalData = [];
let cy;

function renderNode(nodeData) {
    function formatCppCode(code) {
        let indent = 0;
        return code.split("\n").map(line => {
            line = line.trim();
            if (line.startsWith("}")) indent--;
            const result = "\t".repeat(Math.max(0, indent)) + line;
            if (line.endsWith("{")) indent++;
            return result;
        }).join("\n");
    }

    // NAME
    document.getElementById("name").innerText = nodeData.name;

    // DEFINITION
    document.getElementById("definition").innerHTML = `
        <strong>Definition</strong><br>
        ${nodeData.definition}
    `;

    // CATEGORY
    document.getElementById("category").innerHTML = `
        <strong>Category</strong><br>
        ${nodeData.category}
    `;

    // OPERATIONS
    document.getElementById("operations").innerHTML =
        nodeData.operations?.length
            ? `
                <strong>Operations</strong>
                <ul>
                    ${nodeData.operations
                        .map(op => `<li>${op}</li>`)
                        .join("")}
                </ul>
            `
            : "";

    // CODE
    const cppCode = nodeData.code_examples?.cpp || "";
    const codeText = Array.isArray(cppCode) ? cppCode.join("\n") : cppCode;

    if (cppCode) {
        document.getElementById("code").innerHTML = 
            `<strong>Code Example</strong><pre class="code-block"></pre>`;
        document.querySelector("#code .code-block").textContent = formatCppCode(codeText);
    } else {
        document.getElementById("code").innerHTML = "";
    }

    // VISUAL / IMAGES
    document.getElementById("visual").innerHTML =
        nodeData.images?.length
            ? `
                <strong>Visual</strong>
                <div class="image-grid">
                    ${nodeData.images.map(img => `
                        <div class="image-card">
                            <img src="${img.url}" alt="${img.title}">
                            <p>${img.title}</p>
                        </div>
                    `).join("")}
                </div>
            `
            : "";

    // STEP BY STEP
    document.getElementById("stepbystep").innerHTML =
        nodeData.step_by_step?.length
            ? `
                <strong>Step By Step</strong>
                <ol>
                    ${nodeData.step_by_step
                        .map(step => `<li>${step}</li>`)
                        .join("")}
                </ol>
            `
            : "";

    // COMPLEXITY
    document.getElementById("complexity").innerHTML =
        nodeData.time_complexity
            ? `
                <strong>Time Complexity</strong>
                <ul>
                    ${Object.entries(nodeData.time_complexity)
                        .map(([key, value]) =>
                            `<li>${key}: ${value}</li>`)
                        .join("")}
                </ul>
            `
            : "";

    // REAL LIFE EXAMPLES
    document.getElementById("realexample").innerHTML =
        nodeData.real_life_examples?.length
            ? `
                <strong>Real Life Examples</strong>
                <ul>
                    ${nodeData.real_life_examples
                        .map(ex => `<li>${ex}</li>`)
                        .join("")}
                </ul>
            `
            : "";
}

function findNode(data, query) {
    return data.find(item =>
        item.name.toLowerCase() === query.toLowerCase()
    );
}

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
                    id: item.name.trim(),
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
                                source: item.name.trim(),
                                target: rel.target.trim(),
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
                    selector: 'node',
                    style: {
                        'shape': 'round-rectangle',
                        'corner-radius': 100,
                        'width': 'label',
                        'height': 'label',
                        'padding': '16px',
                        'background-color': '#2d3a6b',
                        'label': 'data(label)',
                        'color': 'white',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'font-size': '20px',
                        'text-wrap': 'wrap',
                        'text-max-width': '200px'
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
                    selector: '.highlight',
                    style: {
                        'background-color': '#d4c8f0',
                        'color': '#000',
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

        window.addEventListener("resize", () => {
            cy.resize();
            cy.fit(undefined, 50);
        });

        window.cy = cy;

        cy.on('layoutstop', () => {
            const padding = Math.min(
                window.innerWidth,
                window.innerHeight
            ) * 0.15;

            cy.fit(cy.elements(), padding);
        });

        console.log("GRAPH CREATED SUCCESSFULLY");


        cy.on('tap', 'node', function (evt) {
                const node = evt.target;

                // remove previous highlight
                cy.elements().removeClass("highlight");

                const nodeName = node.id();

                // highlight clicked node
                node.addClass("highlight");

                // zoom + center
                const padding = Math.min(window.innerWidth, window.innerHeight) * 0.2;

                cy.animate({
                    fit: {
                        eles: node,
                        padding: 90
                    },
                    duration: 600
                });

                console.log("CLICKED:", nodeName);

                const nodeData = globalData.find(n =>
                    n.name.trim().toLowerCase() === nodeName.toLowerCase()
                );
                if (nodeData) {
                    renderNode(nodeData);
                }
        });
    }

//globalData = data;

function searchTopic() {

    const input = document.getElementById("searchInput").value.trim();

    console.log("SEARCH START");

    const nodeData = findBestNodeMatch(input);

    console.log("FOUND NODE:", nodeData);

    if(!input) {

        document.getElementById("definition").innerHTML = `
            <br>Please enter a search question.
        `;

        return;
    }
    
    renderNode(nodeData);

    console.log("RENDER FINISHED");

    if (window.cy) {
        const node = cy.$(`node[id = "${nodeData.name}"]`);

        if (node.length > 0) {

            cy.elements().removeClass("highlight");
            node.addClass("highlight");

            const padding = Math.min(window.innerWidth, window.innerHeight) * 0.15;

            cy.animate({
                fit: {
                    eles: node,
                    padding: padding
                },
                duration: 600,
                easing: "ease-out-cubic"
            });
        }
    }
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
        item.name.toLowerCase().includes(cleanedInput) ||
        cleanedInput.includes(item.name.toLowerCase())
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

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("searchButton")
        .addEventListener("click", searchTopic);

    document.getElementById("searchInput")
        .addEventListener("keydown", function(event) {

            if(event.key === "Enter") {
                event.preventDefault();
                searchTopic();
            }
        });
});

document.addEventListener("click", function(event) {
    if(event.target.tagName === "IMG" && event.target.closest(".image-card")) {
        const popup = document.createElement("div");

        popup.className = "image-popup";
        popup.innerHTML = `
            <div class="image-popup-content">
                <span class="image-popup-close">&times;</span>
                <img src="${event.target.src}" alt="${event.target.alt}">
            </div>
        `;

        document.body.appendChild(popup);

        popup.addEventListener("click", function(e) {
            if(e.target.className === "image-popup" || e.target.className === "image-popup-close") {
                popup.remove();
            }
        });
    }
});