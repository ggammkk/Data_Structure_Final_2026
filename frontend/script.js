let globalData = []; // global variable to store loaded JSON data
let cy; // cytoscape instance

// render node details in the right panel
function renderNode(nodeData) { 
    // auto indent code examples 
    function formatCppCode(code) { 
        let indent = 0;
        return code.split("\n").map(line => { // cut the code into array of lines then goes thru each line one by one
            line = line.trim(); // remove any extra spaces at the start and end of each line
            if (line.startsWith("}")) indent--; // remove indent on the current line if it starts with }
            const result = "\t".repeat(Math.max(0, indent)) + line;
            if (line.endsWith("{")) indent++; // add indent on the next line if current line ends with {
            return result;
        }).join("\n");
    }

    // name
    document.getElementById("name").innerText = nodeData.name;

    // definition
    document.getElementById("definition").innerHTML = `
        <strong>Definition</strong><br>
        ${nodeData.definition}
    `;

    // category
    document.getElementById("category").innerHTML = `
        <strong>Category</strong><br>
        ${nodeData.category}
    `;

    // operations
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

    // code examples (cpp)
    const cppCode = nodeData.code_examples?.cpp || "";
    const codeText = Array.isArray(cppCode) ? cppCode.join("\n") : cppCode;
    if (cppCode) {
        document.getElementById("code").innerHTML = 
            `<strong>Code Example</strong><pre class="code-block"></pre>`;
        document.querySelector("#code .code-block").textContent = formatCppCode(codeText);
    } 
    else {
        document.getElementById("code").innerHTML = "";
    }

    // visual / images
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

    // step by step explanation
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

    // complexity
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

    // real life examples
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

// find exact node by name (case insensitive)
function findNode(data, query) {
    return data.find(item =>
        item.name.toLowerCase() === query.toLowerCase()
    );
}

// load all data from node.js API (from backend) and create graph
fetch("http://localhost:3000/api/dsa")
    .then(response => response.json()) // convert response from raw text to a js object
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

    // create graph using cytoscape.js
    function createGraph(data) {
        const elements = []; // array that will hold all nodes and edges
        const nodeNames = new Set(data.map(item => item.name)); // store all nodes name 

        // create nodes
        data.forEach(item => {
            elements.push({
                data: {
                    id: item.name.trim(),
                    label: item.name
                }
            });
        });

        // create edges based on relationships
        data.forEach(item => {
            if(item.relationships && item.relationships.length > 0) {
                item.relationships.forEach(rel => {
                    if(rel.target && rel.type && nodeNames.has(rel.target)) { // if the target node exists, create the edge
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
        
        // initialize cytoscape with elements and styles (creates the actual graph)
        cy = cytoscape({
            container: document.getElementById("cy"), 
            elements: elements, // all the nodes and edges created
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
        // resize graph on window resize
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

        // node click event
        cy.on('tap', 'node', function (evt) {
                const node = evt.target; // the clicked node

                // remove previous highlights
                cy.elements().removeClass("highlight");

                const nodeName = node.id();

                // highlight clicked node
                node.addClass("highlight");

                // fit view to clicked node
                const padding = Math.min(window.innerWidth, window.innerHeight) * 0.2;
                cy.animate({
                    fit: {
                        eles: node,
                        padding: 90
                    },
                    duration: 600
                });
                console.log("CLICKED:", nodeName);

                // find the clicked node's data
                const nodeData = globalData.find(n =>
                    n.name.trim().toLowerCase() === nodeName.toLowerCase()
                );
                if (nodeData) { // if found, render the node
                    renderNode(nodeData);
                }
        });
    }

// search function (search bar input), finds best matching node and renders details
function searchTopic() {
    // get and clean input from frontend search bar
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

// strips common question words to extract the topic name
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
        item.name.toLowerCase().includes(cleanedInput)
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

// search button and enter key event listeners
document.addEventListener("DOMContentLoaded", function() {
    // run search function when the search button is clicked
    document.getElementById("searchButton")
        .addEventListener("click", searchTopic);

    // run search function when enter key is pressed
    document.getElementById("searchInput")
        .addEventListener("keydown", function(event) {
            if(event.key === "Enter") {
                event.preventDefault();
                searchTopic();
            }
        });
});

// open popup when image is clicked
document.addEventListener("click", function(event) {
    if(event.target.tagName === "IMG" && event.target.closest(".image-card")) {
        const popup = document.createElement("div");

        popup.className = "image-popup"; // give class so that 
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

document.getElementById("fullscreenBtn").addEventListener("click", () => {
    const graphEl = document.getElementById("cy");

    if (!document.fullscreenElement) {
        graphEl.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// resize cytoscape graph to fullscreen
document.addEventListener("fullscreenchange", () => {
    setTimeout(() => {
        cy.resize();
        cy.fit(cy.elements(), 80);
    }, 100);
});
