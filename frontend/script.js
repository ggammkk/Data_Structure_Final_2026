const cy = cytoscape({

    // WHERE TO DRAW GRAPH
    container: document.getElementById('cy'),



    // GRAPH DATA
    elements: [

        // ===== NODES =====

        {
            data: {
                id: 'Array'
            }
        },

        {
            data: {
                id: 'Linear Data Structure'
            }
        },

        {
            data: {
                id: 'Static Data Structure'
            }
        },



        // ===== EDGES =====

        {
            data: {
                source: 'Array',
                target: 'Linear Data Structure',
                label: 'is_a'
            }
        },

        {
            data: {
                source: 'Array',
                target: 'Static Data Structure',
                label: 'is_a'
            }
        }

    ],



    // DESIGN / STYLE
    style: [

        // NODE STYLE
        {
            selector: 'node',

            style: {
                'background-color': '#666',

                'label': 'data(id)',

                'color': 'white',

                'text-valign': 'center',

                'text-halign': 'center'
            }
        },



        // EDGE STYLE
        {
            selector: 'edge',

            style: {
                'width': 3,

                'line-color': '#ccc',

                'target-arrow-color': '#ccc',

                'target-arrow-shape': 'triangle',

                'curve-style': 'bezier',

                'label': 'data(label)'
            }
        }

    ],



    // GRAPH LAYOUT
    layout: {
        name: 'cose'
    }

});