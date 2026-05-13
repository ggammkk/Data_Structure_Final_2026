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
                animate: true
            }
        });

        console.log("GRAPH CREATED SUCCESSFULLY");

        cy.on('tap', 'node', function (evt) {
            const node = evt.target;
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
    const resultBox = document.getElementById("resultBox");

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
            resultBox.innerHTML = "<p>Search failed. Check backend/C++ program.</p>";
        });
}