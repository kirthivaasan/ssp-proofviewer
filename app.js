// Error classes
class InvalidCut extends Error {
    constructor(message) {
	super(message);
	this.name = "InvalidCut";
    }
}


// utils
function buildTable(nrows, ncols) {
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

// concatenates oracle calls that point to the same destination node
function reduce_same_dest(neighbours) {
    var nbs_map = new Map(neighbours.map(nb => [nb[0], ""]));

    if (nbs_map.size == neighbours.length) {
	return neighbours;
    } else {
	for (let nb of neighbours) {
	    var pkg = nb[0];
	    var orc = nb[1];

	    var current_entry = nbs_map.get(pkg);
	    if (current_entry == "") {
		nbs_map.set(pkg, orc);
	    } else {
		nbs_map.set(pkg, current_entry + ' , ' + orc);
	    }

	}
	return Array.from(nbs_map);
    }
}


// app drawing
function draw_graph(container, pkg_callgraph, mono_pkgs, config, cut=null, type=null, ghost=null) {
    if (!mxClient.isBrowserSupported()) {
	return -1;
    }

    var graph = new mxGraph(container);

    graph.setCellsResizable(false);
    graph.setResizeContainer(true);
    graph.cellsMovable = false;
    graph.cellsEditable = false;
    graph.allowLoops = true;

    graph.isCellSelectable = function(cell) { // make edges not selectable
    	if (cell.value == '@dashed_rect') {
    	    return false;
    	}
    	return !cell.isEdge();
    };

    // graph.setCellsResizable(true);
    // graph.setResizeContainer(false);
    // graph.cellsMovable = true;

    new mxParallelEdgeLayout(graph).execute(graph.getDefaultParent()); // allow multiple edges

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

    var OFFSET_X = 0;
    var OFFSET_Y = 0;

    var nodes_cfg = config.nodes;

    graph.getModel().beginUpdate();
    try {
	// add invisible adversary package
	var orc_cfg = nodes_cfg['@oracles_interface'];
	var v = graph.insertVertex(parent, null, pkg, orc_cfg.x, orc_cfg.y, orc_cfg.width, orc_cfg.height);
	v.style = 'fillColor=none;strokeColor=none;';
	v.value = '';
	packages.set('@oracles_interface', v);

	// add codeq dashed rect
	if (cut != null && type == 'codeq') {
	    var bbox_min_x = 99999999999999;
	    var bbox_min_y = 99999999999999;
	    var bbox_max_x = -99999999999999;
	    var bbox_max_y = -99999999999999;

	    for (let node of cut) {
		if (node in config.nodes) {
		    var v = config.nodes[node];
		    var x = v.x;
		    var y = v.y;

		    var w = v.width;
		    var h = v.height;


		    if (x < bbox_min_x) {
			bbox_min_x = x;
		    }

		    if (y < bbox_min_y) {
			bbox_min_y = y;
		    }

		    if (x + w > bbox_max_x) {
			bbox_max_x = x + w;
		    }

		    if (y + h > bbox_max_y) {
			bbox_max_y = y + h;
		    }

		} else {
		    throw new InvalidCut('pkg name: ' + node + ' in cut not found in graph.');
		}
	    }

	    var v = graph.insertVertex(parent, null, '@dashed_rect', bbox_min_x-5, bbox_min_y-5, bbox_max_x - bbox_min_x + 10, (bbox_max_y - bbox_min_y) + 10);
	    // v.style = 'fillColor=none;dashed=1';
	    v.style = 'fillColor=none;dashed=1';
	}

	// add rest of packages
	for (node in pkg_callgraph.graph) {
	    var node_cfg = nodes_cfg[node];
	    config_x = node_cfg.x + OFFSET_X;
	    config_y = node_cfg.y + OFFSET_Y;

	    var pkg = doc.createElement('Package');
	    pkg.setAttribute('name', node);
	    var v = graph.insertVertex(parent, null, pkg, config_x, config_y, node_cfg.width, node_cfg.height);
	    packages.set(node, v);

	    if (cut != null && (cut.includes(pkg.attributes.name.value)) && type != null) {
		if (type == 'reduction') {
		    v.style = 'strokeColor=none;fillColor=#808080;opacity=15';
		} else if (type == 'codeq') {
		    // v.style = 'dashed=1;';
		}
	    } else {
		if (node_cfg.color == "blue") {
		    v.style = "fillColor=#dae8fc;strokeColor=#6c8ebf";
		} else if (node_cfg.color == "yellow") {
		    v.style = "fillColor=#fff2cc;strokeColor=#d6b656";
		}
	    }

	    // if (node.substring(0,5) == "dummy") {
	    // 	v.style = 'strokeColor=none;fillColor=#808080;opacity=0';
	    // 	console.log(v);
	    // 	// v.value = "";
	    // 	v.value = null;
	    // }

	}

	// add ghost oracles
	if (ghost != null) {
	    for (pkg_name in ghost) {
		// console.log("GHOST: " + pkg);
		// var node_cfg = nodes_cfg[pkg_name];

		var x = ghost[pkg_name].x;
		var y = ghost[pkg_name].y;
		var edge_style = ghost[pkg_name].style + "dashed=1;";

		// var src_node = graph.insertVertex(parent, null, pkg, node_cfg.x - 200, node_cfg.y, 0, 0);
		var pkg = doc.createElement('GhostPackage');
		var src_node = graph.insertVertex(parent, null, pkg, x, y, 0, 0);

	 	var v1 = packages.get(pkg_name);
		var e1 = doc.createElement("GhostOracle");

	    	e1.setAttribute('oracle_name', "");
		// var edge_style = 'exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;dashed=1;';

		var edge = graph.insertEdge(parent, null, e1, src_node, v1, edge_style);

	    }
	}

	var edges_cfg = config.edges;
	var edge_points = null;
	if (config != null && "edge_points" in config) {
	    edge_points = config["edge_points"];
	}


	// add edges
	for (node in pkg_callgraph.graph) {
	    var neighbours = pkg_callgraph.graph[node];
	    neighbours = reduce_same_dest(neighbours);

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

		// add edge points
		var points = [];
		if (edge_points != null) {
		    if (node in edge_points) {
			var list_of_points = edge_points[node];
			for (let coord of list_of_points) {
			    points.push(new mxPoint(coord.x, coord.y));
			}
		    }
		}
		edge.geometry.points = points;


		if (cut != null && (cut.includes(src_node.value.attributes.name.value) || cut.includes(v1.value.attributes.name.value)) && type != null) {
		    if (type == 'reduction') {
			edge.style += 'opacity=15'; //;fontColor=#ececec
		    } else if (type == 'codeq') {

		    }
		}

	    }
	}

	// add adversary edges
	var src_node = packages.get('@oracles_interface');
	var adversary_calls = reduce_same_dest(pkg_callgraph.oracles);
	for (var i = 0; i < adversary_calls.length; i++) {
	    var el = adversary_calls[i];
	    var pkg_name = el[0];
	    var oracle_name = el[1];
	    var e1 = doc.createElement("Oracle");
	    e1.setAttribute('oracle_name', oracle_name);

	    var v1 = packages.get(pkg_name);
	    var edge_style = 'exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;';
	    // console.log(e1);
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

	if (pkg_name in mono_pkgs) {
	    if ("instance" in mono_pkgs[pkg_name]) {
		// redirect to definition pkg that this instance derives from
		pkg_name = mono_pkgs[pkg_name].instance;
	    }

	    var pkg_def_div = document.getElementById('package_def_container_'+pkg_name);

	    pkg_def_div.setAttribute('class', 'package_def_container highlight');
	    setTimeout(function () {
		pkg_def_div.className = "package_def_container";
		graph.selectionModel.setCells([]);
	    }, 2000);

	    pkg_def_div.scrollIntoView({ behavior: 'smooth'});
	} else {
	    // console.log(pkg_name + " was not found in mono_pkgs")
	}

    }

    return graph;
}

function add_proofstep_content_graphs(proofstep_container, step, graphs, proof, graph_name=null, cut=null, type=null) {
    // must appendChild before calling draw_graph
    var mono_pkgs = proof.monolithic_pkgs;
    var mod_pkgs = proof.modular_pkgs;

    var nrows = graphs.length;
    var ncols = graphs.reduce((acc, e) => e.length > acc? e.length : acc, 0);
    var table = buildTable(nrows, ncols);

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

		var ghost = null;
		if ("ghost" in pkg) {
		    ghost = pkg.ghost;
		}

		var table_cell = table.rows[i].cells[j];

		if (pkg_name == graph_name) {
		    draw_graph(table_cell, cg, mono_pkgs, config, cut, type, ghost);
		} else {
		    draw_graph(table_cell, cg, mono_pkgs, config, null, null, ghost);
		}

		var game_title = document.createElement('div');
		game_title.setAttribute('class', 'game-title');
		game_title.innerHTML = parse_pkg_name(pkg_name);

		table_cell.setAttribute('id', pkg_name);
		table_cell.appendChild(game_title);

	    } else {
		console.log('Couldn\'t find pkg name: ' + pkg_name);
	    }

    	}
    }


}

function add_inlining_oracles(proofstep_container, codeq) {
    var oracles = codeq.oracles;
    var ncols = 0;
    var nrows = 0;

    var header_val = [];
    for (orc in oracles) {
	var code = oracles[orc].code;
	var n = code.split(';').length;
	if (n > nrows) {
	    nrows = n;
	}
	ncols += 1;
	header_val.push(orc);
    }

    var table = buildTable(nrows, ncols);
    table.setAttribute('class', 'inlining-table');

    var j = 0;
    var orc_to_id = {};

    // add parsed lines

    for (orc in oracles) {
	var code = oracles[orc].code;
	var lines = code.split(';');
	for (var i = 0; i < lines.length; i++) {
	    var table_cell = table.rows[i].cells[j];
 	    var line_html = parse_pseudocode_line(lines[i]);
	    table_cell.innerHTML = line_html;
	}
	orc_to_id[orc] = j;
	j++;
    }

    // add parsed header
    if (header_val != null && header_val.length == ncols) {
	var header = table.createTHead();
	var row = header.insertRow(0);
	for (var j = 0; j < ncols; j++) {
	    var cell = row.insertCell(j);
	    var params = []; // default
	    var orc_sig = parse_oracle_signature(header_val[j], params);

	    var orc_sig_div = document.createElement('div');
	    orc_sig_div.innerHTML = orc_sig;
	    orc_sig_div.setAttribute('class', 'oracle-title');
	    cell.appendChild(orc_sig_div);

	    // cell.innerHTML = orc_sig;
	    // cell.setAttribute('class', 'oracle-title');
	}

    }

    if (! ("annotations" in codeq)) {
	return table;
    }

    // add annotations
    var annotations = codeq.annotations;
    for (var ai = 0; ai < annotations.length; ai++) {
	var annot = annotations[ai];

	// var random_color = gen_random_color();
	var random_color = '#bcbcbc';

	for (orc in annot.cells) {
	    if (! (orc in orc_to_id)) {
		throw 2;
	    }
	    var j = orc_to_id[orc];
	    var line_numbers = annot.cells[orc];

	    for (var i = 0; i < line_numbers.length; i++) {
		var l = line_numbers[i];

		if (l >= nrows) {
		    throw 1;
		}

		var cell = table.rows[l+1].cells[j];

		cell.style = "background-color: " + random_color;
		// cell.setAttribute('class', 'pcode-annotated-line');
		var tooltip = document.createElement('div');
		tooltip.setAttribute('class', 'tooltip');

		var tooltiptext = document.createElement('div');
		tooltiptext.setAttribute('class', 'tooltiptext');
		tooltiptext.innerHTML = annot.comment;

		tooltip.appendChild(tooltiptext);
		cell.appendChild(tooltip);

		cell.addEventListener('mouseover', function(elem, comment) {
		    var tooltiptext_wrapper = document.getElementById('tooltiptext_wrapper');
		    tooltiptext_wrapper.innerHTML = comment;
		    tooltiptext_wrapper.style.visibility = "visible";
		    tooltiptext_wrapper.style.opacity = 1;
		}.bind(cell, cell, annot.comment));

		cell.addEventListener('mouseout', function(elem) {
		    var tooltiptext_wrapper = document.getElementById('tooltiptext_wrapper');
		    tooltiptext_wrapper.style.visibility = "hidden";
		    tooltiptext_wrapper.style.opacity = 0;
		}.bind(cell, cell));


	    }
	}
    }

    return table;
}

function add_inlining_steps(proofstep_container, codeq) {
    var oracles_container = document.createElement('div');
    oracles_container.setAttribute('class', 'inlining-container');

    var button = document.createElement('button');
    button.setAttribute('class', 'inlining-btn');
    button.innerHTML = 'Show inlining';
    proofstep_container.appendChild(button);

    var oracles = codeq.oracles;

    for (orc in oracles) {
	// lots of code repetition here, maybe abstract out oracle view creation
	// var orc_container = document.createElement('div');
	// orc_container.setAttribute('class', 'inlining-oracle-container');

	// var orc_title = document.createElement('div');
	// orc_title.setAttribute('class', 'oracle-title');
	// orc_title.innerHTML = parse_oracle_signature(orc, oracles[orc].params);
	// orc_container.appendChild(orc_title);

	// var code = oracles[orc].code;
	// var html = parse_pseudocode_without_links(code);

	// var orc_def = document.createElement('div');
	// orc_def.innerHTML = html;

	// orc_container.appendChild(orc_def);
	// oracles_container.appendChild(orc_container);
    }

    var table = add_inlining_oracles(proofstep_container, codeq);
    oracles_container.appendChild(table);

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

function add_proofstep_content_text(proofstep_container, text) {
    var proofstep_text = document.createElement('div');
    proofstep_text.setAttribute('class', 'proofstep-text');
    proofstep_text.innerHTML = text;
    proofstep_container.appendChild(proofstep_text);
}

// a proofstep consists of contents that comprise of graphs and text
function add_proofstep(nodes_lookup, graph, step, proof) {
    var proofstep_wrapper = document.createElement('div');
    proofstep_wrapper.setAttribute('class', 'proofstep-wrapper');
    proofstep_wrapper.setAttribute('id', 'proofstep-wrapper_'+step);

    var proofstep_container = document.createElement('div');
    proofstep_container.setAttribute('class', 'proofstep');
    proofstep_container.setAttribute('id', 'proofstep_'+step);

    proofstep_wrapper.appendChild(proofstep_container);
    proof_wrapper.appendChild(proofstep_wrapper);

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
	    if ("type" in proof.prooftree[step]) {
		var type = proof.prooftree[step].type;
		if ("reduction" in type) {
		    var reduction = type.reduction;
		    add_proofstep_content_graphs(proofstep_container, step, graphs, proof, reduction.graph, reduction.cut, 'reduction');

		} else if ("codeq" in type) {
		    var codeq = type.codeq;
		    add_proofstep_content_graphs(proofstep_container, step, graphs, proof, codeq.graph, codeq.packages, 'codeq');
    		    add_inlining_steps(proofstep_container, codeq);

		} else {
		    add_proofstep_content_graphs(proofstep_container, step, graphs, proof);
		}
	    } else {
		add_proofstep_content_graphs(proofstep_container, step, graphs, proof);
	    }

	} else if ("text" in content) {
	    var text = content.text;
	    add_proofstep_content_text(proofstep_container, text);
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

    var pkg_defs_sofar = {};
    // Add mono defs in oracle wrapper pane
    var oracle_wrapper = document.getElementById("oracle_wrapper");
    var mono_pkgs = proof.monolithic_pkgs;

    for (pkg_name in mono_pkgs) {
	var pkg = mono_pkgs[pkg_name];

	// if deps == -1 then it means that the pkg does not appear in any graph
	// if deps == [], then it means pkgs appears in the graph but has no dependencies
	var deps = find_mono_pkg_dependencies(proof.modular_pkgs, pkg_name);

	if (deps == -1) {
	    continue;
	}

	if ("instance" in pkg) {
	    var pkg_class = pkg["instance"];
	    if (pkg_class in pkg_defs_sofar) {
		continue;
	    }
	    pkg_name = pkg_class;
	    pkg = mono_pkgs[pkg_name];
	    // continue;
	}
	pkg_defs_sofar[pkg_name] = 1;


	var oracles = pkg.oracles;
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

	    var html_code = parse_pseudocode(pkg_name, orc, deps, oracles[orc].code, mono_pkgs);
	    orc_def.innerHTML = html_code;

	    var orc_calls = orc_def.getElementsByClassName('pcode-oracle-call')

	    for (let callee_div of orc_calls) {
		callee_div.onclick = function(val) {
		    var toks = this.id.split('?');
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
	    // console.log('cell.style'); 	    console.log(cell);

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

const svgToPdfExample = (svg, filename) => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    const doc = new window.PDFDocument();
    const chunks = [];
    const stream = doc.pipe({
	// writable stream implementation
	write: (chunk) => chunks.push(chunk),
	end: () => {
	    const pdfBlob = new Blob(chunks, {
		type: 'application/octet-stream'
	    });
	    var blobUrl = URL.createObjectURL(pdfBlob, );
	    // window.open(blobUrl);
	    a.href = blobUrl;
            a.download = filename;
            a.click();
	},
	// readable streaaam stub iplementation
	on: (event, action) => {},
	once: (...args) => {},
	emit: (...args) => {},
    });

    window.SVGtoPDF(doc, svg, 0, 0);

    doc.end();
};

const exportLatex = (svgs_data, filename) => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    var latex = "\\documentclass{article}\n\\usepackage{graphicx}\n\\begin{document}\n\n";

    var resolution = window.devicePixelRatio;


    for (svg_name in svgs_data) {
	var caption = "caption";
	var label = svg_name;
	var fig = svg_name;

	var pdf_filename = svg_name + ".pdf";
	var scale = 1;

	var height = svgs_data[svg_name].height;
	var width = svgs_data[svg_name].width;
	// trim=left bottom right top

	var figure_tex = `\\begin{figure}[hbt!]\n\\centering\n\\pdfpxdimen=\\dimexpr ${resolution} in/96\\relax\n\\includegraphics[trim=0px 23cm 0cm 0px,clip,scale=${scale}]{${pdf_filename}}\n\\caption{${caption}}\n\\label{fig:${fig}}\n\\end{figure}\n\n`;

	latex += figure_tex;
    }
    latex += "\n\\end{document}";

    var data = new Blob([latex], {type: 'text/plain'});
    var url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = filename;
    a.click();

    return url;

};

function export_graphs_svg() {
    console.log('export');
    var svg_dimensions = {}; // <svg_name> : <dim>
    var all_proofstep_graphs = document.getElementsByClassName('proofstep_graphs');
    for (let graphs of all_proofstep_graphs) {
	var svgs = graphs.getElementsByTagName('svg');
	for (let svg of svgs) {
	    var container = svg.parentNode;
	    var title = container.id;

	    svgToPdfExample(svg, title + ".pdf");

	    var height = svg.clientHeight;
	    var width = svg.clientWidth;
	    svg_dimensions[title] = {"height": height, "width": width};
	}
    }

    console.log(svg_dimensions);
    exportLatex(svg_dimensions, "export.tex");

}

function convert_pkg_names_latex() {
    var all_proofstep_graphs = document.getElementsByClassName('proofstep_graphs');
    for (let graphs of all_proofstep_graphs) {
	var svgs = graphs.getElementsByTagName('svg');
	for (let svg of svgs) {
	    var text_elems = svg.getElementsByTagName('text');
	    for (let elem of text_elems) {
		var res = supsub_compiler_svg(elem.innerHTML);
		elem.innerHTML = res;
	    }
	}


    }
}
