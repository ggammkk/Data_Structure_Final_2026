// LOAD JSON FILE
fetch("../data/dsa_nodes.json")

    .then(response => response.json())

    .then(data => {

        console.log("JSON LOADED SUCCESSFULLY");

        console.log(data);



        // STORE ALL GRAPH ELEMENTS
        let elements = [];



        // =========================
        // CREATE NODES
        // =========================
        data.forEach(item => {

            elements.push({

                data: {
                    id: item.name,
                    label: item.name
                }

            });

        });



        // =========================
        // CREATE EDGES
        // =========================
        data.forEach(item => {

            // CHECK IF relationships EXISTS
            if(item.relationships)
            {
                item.relationships.forEach(rel => {

                    // SKIP INVALID RELATIONSHIPS
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



        // =========================
        // CREATE CYTOSCAPE GRAPH
        // =========================
        const cy = cytoscape({

            // GRAPH CONTAINER
            container: document.getElementById('cy'),



            // GRAPH DATA
            elements: elements,



            // STYLE
            style: [

                // NODE STYLE
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



                // EDGE STYLE
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



            // AUTO LAYOUT
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



        // =========================
        // NODE CLICK EVENT
        // =========================
        cy.on('tap', 'node', function(evt) {

            const node = evt.target;

            const nodeName = node.id();



            console.log("CLICKED:");

            console.log(nodeName);



            // FIND NODE DATA
            const nodeData = data.find(item => item.name === nodeName);



            // DISPLAY INFO
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
                <p>
                    <strong>Operations:</strong>
                    ${nodeData.operations.join(", ")}
                </p>
                <p>
                    <strong>Code Examples:</strong>
                    ${nodeData.code_examples.join("<br>")}
                </p>
                <p>
                    <strong>Real Life Examples:</strong>
                    ${nodeData.real_life_examples.join(", ")}
                </p>

                <p>
                    <strong>Math Relations:</strong>
                    ${nodeData.math_relations.join(", ")}
                </p>

                <h3>Time Complexity</h3>

                <ul>
                    ${complexityHTML}
                </ul>

                `;
                }

        });

    })



    // ERROR HANDLING
    .catch(error => {

        console.log("ERROR LOADING JSON:");

        console.log(error);

    });