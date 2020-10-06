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
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );

    // return (
    //     rect.top >= 0 &&
    //     rect.left >= 0 &&
    //     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
    //     rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    // );

}

// app drawing
function draw_graph(container, pkg_callgraph, config) {
    if (!mxClient.isBrowserSupported()) {
	return -1;
    }

    var graph = new mxGraph(container);

    graph.setCellsResizable(false);
    graph.setResizeContainer(true);
    graph.cellsMovable = false;
    graph.cellsEditable = false;

    graph.isCellSelectable = function(cell) {
	return !cell.isEdge();
    };

    // graph.setCellsResizable(true);
    // graph.setResizeContainer(false);
    // graph.cellsMovable = true;

    this.graph = graph;

    // styling
    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_STROKECOLOR] = 'gray';
    style[mxConstants.STYLE_STROKE] = 'gray';
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_FILLCOLOR] = 'white';
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
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;


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

    var DEFAULT_X = 200;
    DEFAULT_X = 0;
    var DEFAULT_Y = 0;

    var nodes_cfg = config.nodes;

    graph.getModel().beginUpdate();
    try {
	// add invisible adversary package
	var orc_cfg = nodes_cfg['@oracles_interface'];
	var v = graph.insertVertex(parent, null, pkg, orc_cfg.x, orc_cfg.y, orc_cfg.width, orc_cfg.height);
	v.style = 'fillColor=none;strokeColor=none;';
	v.value = '';
	packages.set('@oracles_interface', v);

	// add rest of packages
	for (node in pkg_callgraph.graph) {
	    var node_cfg = nodes_cfg[node];
	    config_x = node_cfg.x + DEFAULT_X;
	    config_y = node_cfg.y + DEFAULT_Y;

	    var pkg = doc.createElement('Package');
	    pkg.setAttribute('name', node);
	    var v = graph.insertVertex(parent, null, pkg, config_x, config_y, node_cfg.width, node_cfg.height);
	    packages.set(node, v);
	}

	var edges_cfg = config.edges;
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

		var edge_style = 'exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;';
		if (edges_cfg != null) {
		    edge_style = edges_cfg[node][pkg_name];
		}

		var edge = graph.insertEdge(parent, null, e1, src_node, v1, edge_style);
	    }
	}

	// add adversary edges
	var src_node = packages.get('@oracles_interface');
	for (var i = 0; i < pkg_callgraph.oracles.length; i++) {
	    var el = pkg_callgraph.oracles[i];
	    var pkg_name = el[0];
	    var oracle_name = el[1];
	    var e1 = doc.createElement("Oracle");
	    e1.setAttribute('oracle_name', oracle_name);

	    var v1 = packages.get(pkg_name);
	    var edge_style = 'exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;';
	    if (edges_cfg != null) {
		edge_style = edges_cfg['@oracles_interface'][pkg_name];
	    }

	    var edge = graph.insertEdge(parent, null, e1, src_node, v1, edge_style);
	}

    } finally {
	graph.getModel().endUpdate();
    }

    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt){
	    updateOracles(graph);
    });


    function updateOracles(graph) {
	var cell = graph.getSelectionCell();
	if (cell == null) return false;

	var pkg_name = cell.getAttribute('name');
	if (pkg_name == undefined) {
	    return -1;
	}

	var pkg_def_div = document.getElementById('package_def_container_'+pkg_name);

	pkg_def_div.setAttribute('class', 'package_def_container highlight');
	setTimeout(function () {
	    pkg_def_div.className = "package_def_container";
	    graph.selectionModel.setCells([]);
	}, 2000);

	pkg_def_div.scrollIntoView({ behavior: 'smooth'});
    }

}

function add_proofstep_content_graphs(proofstep_container, step, graphs, proof) {
    // must appendChild before calling draw_graph
    var mono_pkgs = proof.monolithic_pkgs;
    var mod_pkgs = proof.modular_pkgs;

    var nrows = graphs.length;
    var ncols = graphs.reduce((acc, e) => e.length > acc? e.length : acc, 0);
    var table = buildTable('proofstep_' + step + '_table', nrows, ncols);

    var proofstep_graphs = document.createElement('div');
    proofstep_graphs.setAttribute('class', 'proofstep_graphs');
    proofstep_graphs.appendChild(table);
    proofstep_container.appendChild(proofstep_graphs);


    for (var i = 0; i < graphs.length; i++) {
    	for (var j = 0; j < graphs[i].length; j++) {

    	    var pkg_name = graphs[i][j];
    	    var pkg = mono_pkgs[pkg];

	    if (pkg_name in mod_pkgs) {
		var pkg = mod_pkgs[pkg_name];
    		var cg = new CallGraph(pkg);

		var config = null;
		if ("layout" in pkg) {
		    config = pkg.layout;
		} else {
    		    config = auto_graph_layout(cg);
		}

		var table_cell = table.rows[i].cells[j];
		draw_graph(table_cell, cg, config);

		var game_title = document.createElement('div');
		game_title.setAttribute('class', 'game-title');
		game_title.innerHTML = parse_pkg_name(pkg_name);

		table.rows[i].cells[j].appendChild(game_title);

	    } else {
		console.log('Couldn\'t find pkg name: ' + pkg_name);
	    }

    	}
    }


}

function add_proofstep_content_text(proofstep_container, text) {
    var proofstep_text = document.createElement('div');
    proofstep_text.setAttribute('class', 'proofstep-text');
    proofstep_text.innerHTML = text;
    proofstep_container.appendChild(proofstep_text);
}

// a proofstep consists of contents that comprise of graphs and text
function add_proofstep(nodes_lookup, graph, step, proof) {
    var proofstep_container = document.createElement('div');
    proofstep_container.setAttribute('class', 'proofstep');
    proofstep_container.setAttribute('id', 'proofstep_'+step);
    proof_wrapper.appendChild(proofstep_container);

    // onmouseover is problematic, use onmouseenter instead
    proofstep_container.onmouseenter = function(val){
	// highlight proofstep node in prooftree graph
	var cellname = val.target.id.substr("proofstep_".length);
	if (cellname in nodes_lookup) {
	    var cell = nodes_lookup[cellname];
	    graph.selectionModel.setCells([cell]);
	}
    };

    // adds step name
    var step_name = document.createElement('p');
    step_name.setAttribute('class', 'proofstep-title');
    step_name.innerHTML = step;
    proofstep_container.appendChild(step_name);

    // add contents to proofstep
    var contents = proof.prooftree[step].contents;
    for (let content of contents) {
	if ("graphs" in content) {
	    var graphs = content.graphs;
	    add_proofstep_content_graphs(proofstep_container, step, graphs, proof);
	} else if ("text" in content) {
	    var text = content.text;
	    add_proofstep_content_text(proofstep_container, text);
	}
    }

    // then if proofstep is a codeq step, add the inlining steps
    if ("type" in proof.prooftree[step]) {
	var type = proof.prooftree[step].type;
	if ("codeq" in type) {
	    var oracles_container = document.createElement('div');
	    oracles_container.setAttribute('class', 'inlining_container');

	    var button = document.createElement('button');
	    button.innerHTML = 'Show inlining';
	    proofstep_container.appendChild(button);

	    var oracles = type["codeq"];
	    for (orc in oracles) {

		// lots of code repetition here, maybe abstract out oracle view creation
		var orc_container = document.createElement('div');
		orc_container.setAttribute('class', 'oracle-container');

		var orc_title = document.createElement('div');
		orc_title.setAttribute('class', 'oracle-title');
		orc_title.innerHTML = parse_oracle_signature(orc, oracles[orc].params);
		orc_container.appendChild(orc_title);

		var html = parse_pseudocode_without_links(oracles[orc].code);

		var orc_def = document.createElement('div');
		orc_def.innerHTML = html;

		orc_container.appendChild(orc_def);

		oracles_container.appendChild(orc_container);
	    }

	    oracles_container.style.display = 'none';
	    proofstep_container.appendChild(oracles_container);

	    button.onclick = function() {
		if (oracles_container.style.display == 'none') {
		    oracles_container.style.display = 'block';
		    button.innerHTML = "Hide inlining";
		} else if (oracles_container.style.display == 'block') {
		    oracles_container.style.display = 'none';
		    button.innerHTML = "Show inlining";
		}
	    }


	}

    }




}

function add_proof(proof, wnd_pos, wrapper_width) {
    var proof_wrapper = document.getElementById('proof_wrapper');
    var oracle_wrapper = document.getElementById('oracle_wrapper');

    proof_wrapper.style.width = wrapper_width.proof_width;
    oracle_wrapper.style.width = wrapper_width.oracle_width;

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
	title.innerHTML = parse_pkg_name(pkg_name);
	title.setAttribute('class', 'package_def_title');

	package_def_container.appendChild(title);
	oracle_wrapper.appendChild(package_def_container);

	for (orc in oracles) {
	    var orc_container = document.createElement('div');
	    orc_container.setAttribute('class', 'oracle-container');
	    orc_container.setAttribute('id', 'oracle-container-' + pkg_name + '.' + orc);

	    var orc_title = document.createElement('div');
	    orc_title.setAttribute('class', 'oracle-title');
	    orc_title.innerHTML = parse_oracle_signature(orc, oracles[orc].params);
	    orc_container.appendChild(orc_title);

	    var orc_def = document.createElement('div');
	    var deps = find_mono_pkg_dependencies(proof.modular_pkgs, pkg_name);
	    var html_code = parse_pseudocode(pkg_name, orc, deps, oracles[orc].code);
	    orc_def.innerHTML = html_code;

	    var orc_calls = orc_def.getElementsByClassName('pcode-oracle-call')

	    for (let callee_div of orc_calls) {
		callee_div.onclick = function(val) {
		    console.log(this.id);
		    var toks = this.id.split('_');
		    console.log(toks);

		    var target_div_id = 'oracle-container-' + toks[2];
		    var target_div = document.getElementById(target_div_id);

		    target_div.setAttribute('class', 'oracle-container highlight');
		    setTimeout(function () {
		    	target_div.className = "oracle-container"
		    }, 2000);

		    target_div.scrollIntoView({ behavior: 'smooth'});
		}
	    }

	    orc_container.appendChild(orc_def);
	    package_def_container.appendChild(orc_container);
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

	    var title = proofstep_div.getElementsByClassName('proofstep-title')[0];

	    title.setAttribute('class', 'proofstep-title highlight');
	    setTimeout(function () {
		title.className = "proofstep-title";
	    }, 2000);


	    if (!isElementInViewport(proofstep_div)) {
	    	proofstep_div.scrollIntoView({ behavior: 'smooth'}); // ,block: 'center'
	    }
	}
    }


}
