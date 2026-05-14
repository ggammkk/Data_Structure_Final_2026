
let globalData = [];

fetch("http://localhost:3000/api/dsa")
    .then(response => response.json())
    .then(data => {
        globalData = data;
        function normalize(str) {
            return str.toLowerCase().trim();
        }

        function findNode(data, query) {
            query = normalize(query);

            return data.find(item =>
                normalize(item.name) === query
            );
        }

        console.log("JSON LOADED SUCCESSFULLY");
        console.log(data);

        function renderSection(title, itemsHTML) {
            if (!itemsHTML) return "";
            return `
                <p><strong>${title}</strong></p>
                ${itemsHTML}
            `;
        }

        let elements = [];

        data.forEach(item => {
            elements.push({
                data: {
                    id: item.name,
                    label: item.name
                }
            });
        });

        data.forEach(item => {
            if (item.relationships) {
                item.relationships.forEach(rel => {
                    if (rel.target && rel.type) {
                        elements.push({
                            data: {
                                source: item.name,
                                target: rel.target,
                                label: rel.type
                            }
                        });
                    }
                });
            }
        });

        console.log("GRAPH ELEMENTS:");
        console.log(elements);

        window.cy = cytoscape({
            container: document.getElementById('cy'),
            elements: elements,

            style: [
                {
                    selector: 'node',
                    style: {
                        'shape': 'round-rectangle',
                        'corner-radius': 100,
                        'width': 'label',
                        'height': 'label',
                        'padding': '10px',
                        'background-color': '#041361',
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
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#999',
                        'target-arrow-color': '#999',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'label': 'data(label)',
                        'font-size': '8px',
                        'text-background-color': 'white',
                        'text-background-opacity': 1,
                        'text-background-padding': '2px'
                    }
                },

                {
                    selector: '.highlight',
                    style: {
                        'background-color': '#E5cbcc',
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

        function renderNode(nodeData) {

            // NAME
            document.getElementById("name").innerText =
                nodeData.name || "-";

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
            const cppCode = nodeData.code_examples?.cpp;
            document.getElementById("code").innerHTML =
                cppCode
                    ? `
                        <strong>Code Example</strong>
                        <pre class="code-block">${
                            Array.isArray(cppCode)
                                ? cppCode.join("\n")
                                : cppCode
                        }</pre>
                    `
                    : "";

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
        cy.on('tap', 'node', function (evt) {
            const node = evt.target;

            // remove previous highlight
            cy.elements().removeClass("highlight");

            // highlight clicked node
            node.addClass("highlight");

            // zoom + center properly
            cy.animate({
                fit: {
                    eles: node,
                    padding: Math.min(window.innerWidth * 0.08, 120)
                },
                duration: 600
            });

            const nodeName = node.id();

            console.log("CLICKED:");
            console.log(nodeName);

            const nodeData = findNode(data, nodeName);
            
            if (nodeData){
                renderNode(nodeData);
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

    if (!input) {
        resultBox.innerHTML = "<p>Please enter a search question.</p>";
        return;
    }

    fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(input)}`)
        .then(response => response.json())
        .then(data => {
            const cleanedInput = input
                .toLowerCase()
                .replace("what is", "")
                .replace("define", "")
                .replace("definition of", "")
                .replace("?", "")
                .trim();

            const nodeData = globalData.find(item =>
                item.name.toLowerCase() === cleanedInput ||
                item.name.toLowerCase().includes(cleanedInput) ||
                cleanedInput.includes(item.name.toLowerCase())
            );

            if (!nodeData) {
                resultBox.innerHTML = "<p>Topic not found.</p>";
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
                        padding: Math.min(window.innerWidth * 0.08, 120)
                    },
                    zoom: 1.2,
                    duration: 700
                });
            }

            renderNode(nodeData);        
        })
        .catch(error => {
            console.log("Search error:", error);
            resultBox.innerHTML = "<p>Search failed. Check backend/C++ program.</p>";
        });
}