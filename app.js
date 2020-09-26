// utils

// https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
function isElementInViewport (el) {

    // Special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}

// app drawing
function draw_graph(container_div) {
    if (!mxClient.isBrowserSupported()) {
	return -1;
    }

    var graph = new mxGraph(container);

    var parent = graph.getDefaultParent();
    var doc = mxUtils.createXmlDocument();

    graph.getModel().beginUpdate();

    try {
	// v = graph.insertVertex(parent, null, pkg, config_x, config_y, width, height);
    } finally {
	graph.getModel().endUpdate();
    }

}

function add_proof_tree_window(proofname, prooftree, wnd_height, wnd_width, wnd_x, wnd_y) {
    var tb = document.createElement('div');

    var wnd = new mxWindow('Proof Tree', tb, wnd_x, wnd_y, wnd_width, wnd_height, true, true);
    wnd.setMaximizable(true);
    wnd.setVisible(true);
    wnd.setResizable(true);

    var graph = new mxGraph(tb);
    graph.setTooltips(true);
    graph.setPanning(true);
    graph.setCellsResizable(false);

    var rubberband = new mxRubberband(graph);
    new mxKeyHandler(graph);

    var parent = graph.getDefaultParent();

    var layout = new mxCompactTreeLayout(graph, false);
    layout.useBoundingBox = false;
    layout.edgeRouting = false;
    layout.levelDistance = 30;
    layout.nodeDistance = 10;


    var layoutMgr = new mxLayoutManager(graph);

    layoutMgr.getLayout = function(cell) {
	if (cell.getChildCount() > 0) {
	    return layout;
	}
    };


    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_STROKECOLOR] = 'gray';
    style[mxConstants.STYLE_STROKE] = 'gray';
    style[mxConstants.STYLE_ROUNDED] = false;
    style[mxConstants.STYLE_FILLCOLOR] = '#b5d3f1';
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_SPACING] = 4;

    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_STROKECOLOR] = '#0C0C0C';

    // lookup for node names to their mxCell objects
    var nodes_lookup = {};

    graph.getModel().beginUpdate();
    try {
	var w = graph.container.offsetWidth;

	for (let node_name in prooftree) {
	    if (prooftree[node_name].parent == null) {
	    	var v1 = graph.insertVertex(parent, node_name, node_name, w/2 - 30, 20, 60, 40);
	    	nodes_lookup[node_name] = v1;
	    } else {
	    	var v1 = graph.insertVertex(parent, node_name, node_name, 0, 0, 60, 40);
	    	nodes_lookup[node_name] = v1;
	    }
	}

	for (let node_name in prooftree) {
	    var ancestor_name = prooftree[node_name].parent;
	    var node_vtx = nodes_lookup[node_name];
	    var ancestor_vtx = nodes_lookup[ancestor_name];
	    graph.insertEdge(parent, null, '', ancestor_vtx, node_vtx);
	}

    } finally {
    	graph.getModel().endUpdate();
    }

    // panning
    graph.panningHandler.useLeftButtonForPanning = true;
    graph.panningHandler.ignoreCell = true;
    graph.container.style.cursor = 'move';
    graph.setPanning(true);


    // Add proof title
    var proof_title = document.getElementById("proof_title");
    proof_title.innerHTML = proofname;

    var proof_wrapper = document.getElementById("proof_wrapper");

    // Add all proofsteps
    for (step in prooftree) {
	var proofstep_container = document.createElement('div');
	proofstep_container.setAttribute('class', 'proofstep');
	proofstep_container.setAttribute('id', 'proofstep_'+step);

	proofstep_container.onmouseover = function(val){
	    // highlight proofstep node in prooftree graph
	    var cellname = val.target.id.substr("proofstep_".length);
	    if (cellname in nodes_lookup) {
		var cell = nodes_lookup[cellname];
		graph.selectionModel.setCells([cell]);
	    }
	};

	var text = document.createElement('p');
	text.innerHTML = "Proofstep: " + step;
	proofstep_container.appendChild(text);

	proof_wrapper.appendChild(proofstep_container);
    }


    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt){
	updateProofStep(graph);
    });

    function updateProofStep(graph) {
	var cell = graph.getSelectionCell();
	if (cell != null) {
	    var target_proofstep_id = 'proofstep_' + cell.value;
	    var proofstep_div = document.getElementById(target_proofstep_id)
	    if (!isElementInViewport(proofstep_div)) {
		proofstep_div.scrollIntoView({ behavior: 'instant', block: 'center' });
	    }
	}

    }

}

var test_proof_name = "Yao's Garbled Circuits";

var test_prooftree = {"a" : {"parent": null},
		      "b" : {"parent": "a"},
		      "c" : {"parent": "a"},
		      "d" : {"parent": "c"},
		      "e" : {"parent": "d"}
		     };

var pkgs = {"Enc": {"oracles":
		    [
			{"name": "ENC",
			 "params": ["x"],
			 "code": "k <- GET();c <-$ f.enc(k, x);return c;"
			}
		    ]
		   },
	    "Prf": {"oracles": []},
	    "Key": {"oracles": []}
	   };

function main() {
    add_proof_tree_window(test_proof_name, test_prooftree, 300, 300, 1600, 600);
}

main();
