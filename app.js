// utils
function buildTable(table_id, nrows, ncols) {
    var newTable = document.createElement("table");
    for (var i = 0; i < nrows; i++) {
	var row = newTable.insertRow();
	for (var j = 0; j < ncols; j++) {
	    row.insertCell(j);
	}
    }
    return newTable;
}

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
function draw_graph(proof, container, pkg_callgraph, config=null) {
    if (!mxClient.isBrowserSupported()) {
	return -1;
    }

    var graph = new mxGraph(container);

    // graph.setCellsResizable(false);
    // graph.setResizeContainer(true);
    // graph.cellsMovable = false;

    graph.setCellsResizable(true);
    graph.setResizeContainer(false);
    graph.cellsMovable = true;

    this.graph = graph;

    // styling
    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_STROKECOLOR] = 'gray';
    style[mxConstants.STYLE_STROKE] = 'gray';
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_SPACING] = 4;

    // edge style
    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_STROKECOLOR] = '#0C0C0C';
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_FONTSIZE] = '10';
    style[mxConstants.STYLE_STROKEWIDTH] = '1.25';


    var parent = graph.getDefaultParent();
    var doc = mxUtils.createXmlDocument();

    graph.convertValueToString = function(cell)
    {
	if (mxUtils.isNode(cell.value)) {
	    if (cell.value.nodeName.toLowerCase() == 'package') {
		var name = cell.getAttribute('name', '');
		if (name != null && name.length > 0) {
		    return name;
		}
		return 'Unnamed Package';
	    } else if (cell.value.nodeName.toLowerCase() == 'oracle') {
		var oracle_name = cell.getAttribute('oracle_name', '');
		return oracle_name;
	    }
	}
	return '';
    };


    var packages = new Map();
    var width = 90;
    var height = 40;


    var DEFAULT_X = 200;
    var DEFAULT_Y = 0;
    var config_x = DEFAULT_X/2;
    var config_y = DEFAULT_Y/2;


    graph.getModel().beginUpdate();
    try {
	// add invisible interface node
	var v = graph.insertVertex(parent, null, pkg, config_x, config_y, 20, 4*height);
	v.style = 'fillColor=none;strokeColor=none;';
	v.value = '';
	packages.set('@oracles_interface', v);

	// add rest of packages
	for (node in pkg_callgraph.graph) {
	    // config_x += width + width/2;
	    // config_y += height;
	    config_x = config[node].x + DEFAULT_X;
	    config_y = config[node].y + DEFAULT_Y;

	    var pkg = doc.createElement('Package');
	    pkg.setAttribute('name', node);
	    var v = graph.insertVertex(parent, null, pkg, config_x, config_y, width, height);
	    packages.set(node, v);
	}

	// add edges
	for (node in pkg_callgraph.graph) {
	    var neighbours = pkg_callgraph.graph[node];
	    var src_node = packages.get(node);

	    for (let nb of neighbours) {
		var pkg_name = nb[0];
		var oracle_name = nb[1];
		var v1 = packages.get(pkg_name);
		var e1 = doc.createElement("Oracle");
	    	e1.setAttribute('oracle_name', oracle_name);

		var style = 'edgeStyle=elbowEdgeStyle;elbow=horizontal;exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;';
		var edge = graph.insertEdge(parent, null, e1, src_node, v1, style);
	    }
	}

	var src_node = packages.get('@oracles_interface');
	for (var i = 0; i < pkg_callgraph.oracles.length; i++) {
	    var el = pkg_callgraph.oracles[i];
	    var pkg_name = el[0];
	    var oracle_name = el[1];
	    var e1 = doc.createElement("Oracle");
	    e1.setAttribute('oracle_name', oracle_name);

	    var v1 = packages.get(pkg_name);
	    var style = 'edgeStyle=elbowEdgeStyle;elbow=horizontal;exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;';
	    var edge = graph.insertEdge(parent, null, e1, src_node, v1, style);

	}

    } finally {
	graph.getModel().endUpdate();
    }

    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt){
	    updateOracles(graph);
    });


    function updateOracles(graph) {
	// graph.container.focus();
	var cell = graph.getSelectionCell();
	var pkg_name = cell.getAttribute('name');
	var pkg_def_div = document.getElementById('package_def_container_'+pkg_name);

	pkg_def_div.setAttribute('class', 'package_def_container highlight');
	setTimeout(function () {pkg_def_div.className = "package_def_container"}, 2000);

	if (!isElementInViewport(pkg_def_div)) {
	    pkg_def_div.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

    }

}

function add_proofstep(nodes_lookup, graph, step, proof) {
    var proofstep_container = document.createElement('div');
    proofstep_container.setAttribute('class', 'proofstep');
    proofstep_container.setAttribute('id', 'proofstep_'+step);

    // onmouseover is problematic, use onmouseenter instead
    proofstep_container.onmouseenter = function(val){
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

    var target_proofstep_id = 'proofstep_'+ step;
    var graphs = proof.prooftree[step].graphs;

    var nrows = graphs.length;
    var ncols = graphs.reduce((acc, e) => e.length > acc? e.length : acc, 0);

    var table = buildTable(target_proofstep_id + '_table', nrows, ncols);

    var mono_pkgs = proof.monolithic_pkgs;
    var mod_pkgs = proof.modular_pkgs;

    for (var i = 0; i < graphs.length; i++) {
    	for (var j = 0; j < graphs[i].length; j++) {
    	    var pkg_name = graphs[i][j];
    	    var pkg = proof.monolithic_pkgs[pkg];

	    if (pkg_name in mod_pkgs) {
		var pkg = mod_pkgs[pkg_name];
    		var cg = new CallGraph(pkg);
    		var config = auto_graph_layout(cg);
		draw_graph(proof, table.rows[i].cells[j], cg, config);
	    } else {
		console.log('Couldn\'t find pkg name: ' + pkg_name);
	    }

    	}
    }

    proofstep_container.appendChild(table);
}

function add_proof(proof, wnd_pos) {
    var prooftree = proof.prooftree;

    var tb = document.createElement('div');
    mxGraph.prototype.collapsedImage = new mxImage(mxClient.imageBasePath + '/collapsed.gif', 9, 9);
    mxGraph.prototype.expandedImage = new mxImage(mxClient.imageBasePath + '/expanded.gif', 9, 9);

    var wnd = new mxWindow('Proof Tree', tb, wnd_pos.x, wnd_pos.y, wnd_pos.width, wnd_pos.height, true, true);
    wnd.setMaximizable(true);
    wnd.setVisible(true);
    wnd.setResizable(true);

    var graph = new mxGraph(tb);
    graph.setTooltips(true);
    graph.setPanning(true);
    graph.setCellsResizable(false);
    graph.keepEdgesInBackground = true;

    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = 'treenode';
    style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
    style[mxConstants.STYLE_SHADOW] = true;
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_FONTSIZE] = '12';

    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;
    style[mxConstants.STYLE_ROUNDED] = true;

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

    // Below is code used directly from mxgraph/examples tree.html
    // condition for showing folding icon
    graph.isCellFoldable = function(cell) {
	return this.model.getOutgoingEdges(cell).length > 0;
    };

    // position folding icon
    graph.cellRenderer.getControlBounds = function(state)
    {
	if (state.control != null) {
	    var oldScale = state.control.scale;
	    var w = state.control.bounds.width / oldScale;
	    var h = state.control.bounds.height / oldScale;
	    var s = state.view.scale;

	    return new mxRectangle(state.x + state.width / 2 - w / 2 * s,
				   state.y + state.height + TreeNodeShape.prototype.segment * s - h / 2 * s,
				   w * s, h * s);
	}
	return null;
    };

    // Implements the click on a folding icon
    graph.foldCells = function(collapse, recurse, cells)
    {
    	this.model.beginUpdate();
    	try
    	{
    	    toggleSubtree(this, cells[0], !collapse);
    	    this.model.setCollapsed(cells[0], collapse);

    	    // Executes the layout for the new graph since
    	    // changes to visiblity and collapsed state do
    	    // not trigger a layout in the current manager.
    	    layout.execute(graph.getDefaultParent());
    	}
    	finally
    	{
    	    this.model.endUpdate();
    	}
    };


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

    var proof_wrapper = document.getElementById("proof_wrapper");

    // var proof_details = document.createElement('div');
    // proof_details.innerHTML = "<h3>" + proof.name + "</h3>";
    // proof_wrapper.appendChild(proof_details);

    // Add all proofsteps
    for (step in prooftree) {
	add_proofstep(nodes_lookup, graph, step, proof);
    }

    // Add mono defs in oracle wrapper pane
    var oracle_wrapper = document.getElementById("oracle_wrapper");
    var mono_pkgs = proof.monolithic_pkgs;

    for (pkg_name in mono_pkgs) {
	var oracles = mono_pkgs[pkg_name].oracles;
	var package_def_container = document.createElement('div');
	package_def_container.setAttribute('class', 'package_def_container');
	package_def_container.setAttribute('id', 'package_def_container_'+pkg_name);

	var title = document.createElement('p');
	title.innerHTML = pkg_name;
	title.setAttribute('class', 'package_def_title');

	package_def_container.appendChild(title);
	oracle_wrapper.appendChild(package_def_container);

	for (orc in oracles) {
	    var orc_def = document.createElement('div');
	    orc_def.setAttribute('class', 'oracle_def_container');
	    orc_def.innerHTML = orc;

	    package_def_container.appendChild(orc_def);
	}
    }


    // Updates the visible state of a given subtree taking into
    // account the collapsed state of the traversed branches
    function toggleSubtree(graph, cell, show)
    {
	show = (show != null) ? show : true;
	var cells = [];

	graph.traverse(cell, true, function(vertex) {
	    if (vertex != cell) {
		cells.push(vertex);
		document.getElementById("proofstep_" + vertex.value).style.display = "none";
	    }
	    // Stops recursion if a collapsed cell is seen
	    return vertex == cell || !graph.isCellCollapsed(vertex);
	});

	graph.toggleCells(show, cells, true);

	if (show) {
	    for (let vertex of cells) {
		console.log(vertex);
		document.getElementById("proofstep_" + vertex.value).style.display = "block";
	    }
	}
    };


    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt){
    	updateProofStep(graph);
    });


    function updateProofStep(graph) {
	var cell = graph.getSelectionCell();
	if (cell != null) {
	    var target_proofstep_id = 'proofstep_' + cell.value;
	    var proofstep_div = document.getElementById(target_proofstep_id);
	    if (!isElementInViewport(proofstep_div)) {
		proofstep_div.scrollIntoView({ behavior: 'smooth', block: 'center' });
	    }
	}
    }


}
