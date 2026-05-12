// LOAD JSON FILE
fetch("../data/dsa_nodes.json")

    .then(response => response.json())

    .then(data => {

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
            if(item.relationships)
            {
                item.relationships.forEach(rel => {
                    if(rel.target && rel.type)
                    {
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

<<<<<<< HEAD
        const cy = cytoscape({
=======
        window.cy = cytoscape({
>>>>>>> a030c9d4dab15db2bb32533cbe3cbce88bd65e24
            container: document.getElementById('cy'),
            elements: elements,

            style: [
                {
                    selector: 'node',
                    style: {
                        'shape': 'ellipse',
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

        cy.on('tap', 'node', function(evt) {
            const node = evt.target;
            const nodeName = node.id();

            console.log("CLICKED:");
            console.log(nodeName);

            const nodeData = data.find(item =>
                item.name.trim().toLowerCase() === nodeName.trim().toLowerCase()
            );
            const resultBox = document.getElementById('resultBox');

            if(nodeData){
                let complexityHTML = "";
                for(const key in nodeData.time_complexity)
                    {complexityHTML += `<li>${key}: ${nodeData.time_complexity[key]}</li>`;}
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
                <p><strong>Code Examples:</strong></p>
                <pre class="code-block">${(nodeData.code_examples?.cpp || nodeData.code_examples || []).join("\n")}</pre>
                ${nodeData.real_life_examples && nodeData.real_life_examples.length > 0 ? `
                    <p><strong>Real Life Examples:</strong></p>
                    <p>${nodeData.real_life_examples.join(", ")}</p>
                ` : ""}

                ${nodeData.math_relations && nodeData.math_relations.length > 0 ? `
                    <p><strong>Math Relations:</strong></p>
                    <p>${nodeData.math_relations.join(", ")}</p>
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
<<<<<<< HEAD
    });
=======
    });

function searchTopic() {
    const input = document.getElementById("searchInput").value;

    const node = window.cy.getElementById(input);

    if (!node || node.length === 0) {
        console.log("Node not found");
        return;
    }

    window.cy.animate({
        fit: {
            eles: node,
            padding: 80
        },
        duration: 500
    });

    node.style({
        'background-color': '#E5cbcc',
        'color': '#000'
    });
}
>>>>>>> a030c9d4dab15db2bb32533cbe3cbce88bd65e24
