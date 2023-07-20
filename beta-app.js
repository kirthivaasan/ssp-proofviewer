XML_EXPORT_OPTION = false;

var PKG_COLORS = {
    "blue": {fill: "#dae8fc", stroke: "#6c8ebf"},
    "yellow": {fill: "#fff2cc", stroke: "#d6b656"},
    "grey": {fill: "#d4d4d4", stroke: "#000000"},
    "gray": {fill: "#d4d4d4", stroke: "#000000"},
    "purple": {fill: "#e1d5e7", stroke: "#9673a6"},
    "green": {fill: "#d5e8d4", stroke: "#82b366"},
    "red": {fill: "#f8cecc", stroke: "#b85450"},
    "default_color": {fill: "#ffffff", stroke: "#000000"}
}

// ======================================
// custom line hatch shape for reductions
// ======================================
function KpLineHatch() {
    mxCylinder.call(this);
};

mxUtils.extend(KpLineHatch, mxCylinder);

KpLineHatch.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    if (isForeground) {
	// more complex than brain surgery
	var m = 1;
	var c = 0;
	var x1 = -1*(1/m)*w; var y1 = 0;
	var x2 = 0; var y2 = 0;
	var interval = x1;
	var interval_size = 20;

	var points = []; // useful for finding y interval size.

	while (interval < w) {
	    x1 = interval;
	    y1 = 0;
	    y2 = h;
	    x2 = (y2/m) + x1;

	    if (x2 > 0) {
		var x1_old = x1;

		if (x1 < 0) {
		    y1 = m*-x1;
		    x1 = 0;
		}

		if (x2 > w) {
		    x2 = w;
		    y2 = m*(x2-x1_old);
		}

		path.moveTo(x1, y1);
		path.lineTo(x2, y2);
	    }

	    points.push([x1, y1]);
	    interval += interval_size;
	}


	var max_y_interval = 0;
	var y_interval_size = 0;
	for (var i = 1; i < points.length; i++) {
	    if (points[i-1][0] == 0 && points[i][0] == 0) {
		y_interval_size = points[i-1][1] - points[i][1];
	    }
	}

	for (var i = 0; i < points.length; i++) {
	    if (points[i][0] == 0 && points[i][1] > max_y_interval) {
		max_y_interval = points[i][1]; // takes the last point (y coord) added previously
	    }
	}

	if (y_interval_size > 0) {
	    interval = max_y_interval + y_interval_size;

	    while (interval < h) {
		x1 = 0;
		y1 = interval;

		x2 = w;
		y2 = m*(x2+x1) + y1;

		if (y2 > h) {
		    x2 = ((h-y1)/m) + x1;
		    y2 = h;
		}

		path.moveTo(x1, y1);
		path.lineTo(x2, y2);

		interval += y_interval_size;
	    }

	}

	path.close();

    } else {
	// bounding box
	path.moveTo(0, 0);
	path.lineTo(w, 0);
	path.lineTo(w, h);
	path.lineTo(0, h);
	path.lineTo(0, 0);
    }
}
mxCellRenderer.registerShape('kplinehatch', KpLineHatch);
// ==========End of custom line hatch shape==============



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
function draw_graph(container, pkg_callgraph, mono_pkgs, config, cut=null, type=null, ghost=null, dashed=null, display=null, decoration=null) {
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

    if (XML_EXPORT_OPTION) {
	container.appendChild(mxUtils.button('View XML', function() {
	    var encoder = new mxCodec();
	    var node = encoder.encode(graph.getModel());
	    mxUtils.popup(mxUtils.getPrettyXml(node), true);
	}));
    }

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
	    } else if (cell.value.nodeName.toLowerCase() == 'vellipsis') {
		var div = document.createElement('div');
		div.innerHTML = cell.getAttribute('label');
		mxUtils.br(div);
		div.innerHTML = "$$\\vdots$$";
		return div;
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

	// add rest of packages
	for (node in pkg_callgraph.graph) {
	    var node_cfg = nodes_cfg[node];
	    config_x = node_cfg.x + OFFSET_X;
	    config_y = node_cfg.y + OFFSET_Y;

	    var pkg = doc.createElement('Package');

	    pkg.setAttribute('name', node);

	    if (display != null) {
		if (node in display) {
	    	    pkg.setAttribute('name', display[node]);
		}
	    }
	    pkg.setAttribute('label', node);


	    var v = graph.insertVertex(parent, null, pkg, config_x, config_y, node_cfg.width, node_cfg.height);
	    packages.set(node, v);

	    var pkg_color = PKG_COLORS.default_color.fill;
	    var pkg_stroke = PKG_COLORS.default_color.stroke;

	    if (node_cfg.color in PKG_COLORS) {
		pkg_color = PKG_COLORS[node_cfg.color].fill;
		pkg_stroke = PKG_COLORS[node_cfg.color].stroke;
	    }

	    if (cut != null && (cut.includes(pkg.attributes.name.value)) && type != null) {
		if (type == 'reduction') {
		    v.style = "fillColor=" + pkg_color + ";strokeColor=brown;strokeWidth=3;" + ';shape=kplinehatch;opacity=100;';
		    // v.style = 'strokeColor=none;fillColor=#808080;opacity=15';
		} else if (type == 'codeq') {
		    // v.style = 'dashed=1;';
		    v.style = "fillColor=" + pkg_color + ";strokeColor=green;strokeWidth=2;" + ';shape=kplinehatch;opacity=100;';
		}
	    } else {
		v.style = "fillColor=" + pkg_color + ";strokeColor="+ pkg_stroke;
	    }

	    // else {
	    // 	var pkg_color = PKG_COLORS.default_color.fill;
	    // 	var pkg_stroke = PKG_COLORS.default_color.stroke;

	    // 	if (node_cfg.color in PKG_COLORS) {
	    // 	    pkg_color = PKG_COLORS[node_cfg.color].fill;
	    // 	    pkg_stroke = PKG_COLORS[node_cfg.color].stroke;
	    // 	}
	    // 	v.style = "fillColor=" + pkg_color + ";strokeColor="+ pkg_stroke;
	    // }

	}

	// add decoration
	if (decoration != null) {
	    if ("vellipses" in decoration) {
		var vellipse_id = 0;
		for (var i = 0; i < decoration.vellipses.length; i++) {
		    coord = decoration.vellipses[i];

		    var obj = doc.createElement('Vellipsis');
		    obj.setAttribute('label', 'Hello, World!');
		    obj.setAttribute('checked', 'false');
		    var v = graph.insertVertex(parent, null, obj, coord.x, coord.y, 10, 25);
		    v.style = 'fillColor=none;strokeColor=none;';
		    vellipse_id += 1;
		}
	    }

	}

	// add ghost oracles
	if (ghost != null) {
	    for (pkg_name in ghost) {
		// console.log("GHOST: " + pkg);
		// var node_cfg = nodes_cfg[pkg_name];

		var x = ghost[pkg_name].x;
		var y = ghost[pkg_name].y;
		var edge_style = ghost[pkg_name].style + "dashed=1;";

		if (cut != null && (cut.includes(pkg_name)) && type != null) {
		    if (type == 'reduction') {
			edge_style += "strokeColor=brown;";
		    } else if (type == 'codeq') {
			edge_style += "strokeColor=green;";
		    }

		}

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
		if (pkg_name == null) continue;

		var e1 = doc.createElement("Oracle");
	    	e1.setAttribute('oracle_name', oracle_name);
		e1.setAttribute('label', oracle_name);


		// var edge_style = 'exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;';
		var edge_style = "";
		if (edges_cfg != null) {
		    edge_style = edges_cfg[node][pkg_name];
		    edge_style = "edgeStyle=elbowEdgeStyle;elbow=horizontal;rounded=1;orthogonalLoop=1;html=1;labelBackgroundColor=#ffffffcf;" + edge_style;
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
			edge.style += 'strokeColor=brown;fontColor=brown;'; //;fontColor=#ececec
		    } else if (type == 'codeq') {
			edge.style += 'strokeColor=green;fontColor=green;'
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
	    e1.setAttribute('label', oracle_name);

	    var v1 = packages.get(pkg_name);
	    var edge_style = 'exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;';
	    // console.log(e1);
	    if (edges_cfg != null) {
		edge_style = edges_cfg['@oracles_interface'][pkg_name];
	    }

	    if (cut != null && (cut.includes(pkg_name)) && type != null) {
		if (type == 'reduction') {
		    edge_style += "fontColor=brown;strokeColor=brown;";
		} else if (type == 'codeq') {
			edge_style += "fontColor=green;strokeColor=green;";
		}
	    }


	    var edge = graph.insertEdge(parent, null, e1, src_node, v1, edge_style);
	}

	// add codeq dashed rect
	// if (cut != null && (type == 'codeq' || type == 'plugin')) {
	//     var bbox_min_x = 99999999999999;
	//     var bbox_min_y = 99999999999999;
	//     var bbox_max_x = -99999999999999;
	//     var bbox_max_y = -99999999999999;

	//     for (let node of cut) {
	// 	if (node in config.nodes) {
	// 	    var v = config.nodes[node];
	// 	    var x = v.x;
	// 	    var y = v.y;

	// 	    var w = v.width;
	// 	    var h = v.height;


	// 	    if (x < bbox_min_x) {
	// 		bbox_min_x = x;
	// 	    }

	// 	    if (y < bbox_min_y) {
	// 		bbox_min_y = y;
	// 	    }

	// 	    if (x + w > bbox_max_x) {
	// 		bbox_max_x = x + w;
	// 	    }

	// 	    if (y + h > bbox_max_y) {
	// 		bbox_max_y = y + h;
	// 	    }

	// 	} else {
	// 	    throw new InvalidCut('pkg name: ' + node + ' in cut not found in graph.');
	// 	}
	//     }

	//     var v = graph.insertVertex(parent, null, '@dashed_rect', bbox_min_x-5, bbox_min_y-5, bbox_max_x - bbox_min_x + 10, (bbox_max_y - bbox_min_y) + 10);
	//     v.style = 'fillColor=gray;dashed=1;opacity=20;';
	// }


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

function add_proofstep_content_graphs_reduction(proofstep_container, step, graphs, proof, reduction, type) {

    var names_and_cuts = {};
    for (var i = 0; i < reduction.length; i++) {
	var ith_cut = reduction[i];
	var name = graphs[ith_cut.i][ith_cut.j];
	names_and_cuts[name] = ith_cut;
    }

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

		var display = null;
		if ("display" in pkg) {
		    display = pkg.display;
		}

		var ghost = null;
		if ("ghost" in pkg) {
		    ghost = pkg.ghost;
		}

		var decoration = null;
		if ("decoration" in pkg) {
		    decoration = pkg.decoration;
		}

		var table_cell = table.rows[i].cells[j];

		var elem = names_and_cuts[pkg_name]; // single element out of the list of elements in the reduction key
		var elem_tmp = names_and_cuts[pkg_name];
		for (var k = 0; k < reduction.length; k++) {
		    elem_tmp = reduction[k];
		    if (elem_tmp.i == i && elem_tmp.j == j) {
			elem = elem_tmp;
		    }
		}

		if (pkg_name in names_and_cuts) {
		    if (elem.i == i && elem.j == j) {
			var cut = elem.cut;
			if ("name" in elem) {
			    pkg_name = elem.name;
			}
			draw_graph(table_cell, cg, mono_pkgs, config, cut, type, ghost, null, display, decoration);
		    } else {
			draw_graph(table_cell, cg, mono_pkgs, config, null, type, ghost, null, display, decoration);
		    }
		} else {
		    draw_graph(table_cell, cg, mono_pkgs, config, null, null, ghost, null, display, decoration);
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

		var display = null;
		if ("display" in pkg) {
		    display = pkg.display;
		    console.log(display);
		}

		var ghost = null;
		if ("ghost" in pkg) {
		    ghost = pkg.ghost;
		}

		var decoration = null;
		if ("decoration" in pkg) {
		    decoration = pkg.decoration;
		}

		var table_cell = table.rows[i].cells[j];

		if (pkg_name == graph_name) {
		    draw_graph(table_cell, cg, mono_pkgs, config, cut, type, ghost, null, display, decoration);
		} else {
		    draw_graph(table_cell, cg, mono_pkgs, config, null, null, ghost, null, display, decoration);
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
    // var oracles = codeq.oracles;
    var ncols = 0;
    var nrows = 0;

    // var header_val = [];
    // for (orc in oracles) {
    // 	var code = oracles[orc].code;
    // 	var n = code.split(';').length;
    // 	console.log(n);
    // 	if (n > nrows) {
    // 	    nrows = n;
    // 	}
    // 	ncols += 1;
    // 	header_val.push(orc);
    // }

    // assumes that JSON file has oracles ordered in a consistent way (across pkgs)
    var pkg_lengths = [];
    for (pkg in codeq.packages) {
	var num_rows = 0;
	var oracles = codeq.packages[pkg].oracles;
	for (orc in oracles) {
	    var code = oracles[orc].code;
    	    var n = code.split(';').length;
	    num_rows += n;
	}
	pkg_lengths.push(num_rows);
    }
    var max_orc_len = Math.max.apply(null, pkg_lengths);
    var nrows = max_orc_len + 3*pkg_lengths.length + 1; // enough space for pkg title, oracle titles and spaces
    ncols = pkg_lengths.length*2; // dummy columns for spacing (yes I know this is bad practice :( )

    var table = buildTable(nrows, ncols);
    table.setAttribute('class', 'inlining-table');

    var j = 0;
    for (pkg in codeq.packages) {
	var table_cell = table.rows[0].cells[j]; // pkg title cell
	table_cell.innerHTML = parse_pkg_name(pkg);
	table_cell.setAttribute('class', 'package_def_title');

	var k = 1;
	var oracles = codeq.packages[pkg].oracles;
	for (orc in oracles) {
	    table_cell = table.rows[k].cells[j]; // oracle title cell
	    table_cell.setAttribute('class', 'oracle-title');
	    table_cell.innerHTML = parse_oracle_signature(orc, oracles[orc].params);
	    k++;
	    var code = oracles[orc].code;
    	    var lines = code.split(';');
	    for (var i = 0; i < lines.length; i++) {
    		var line_html = parse_pseudocode_line(lines[i]);
		table_cell = table.rows[k].cells[j];
		var line_div = document.createElement('div');
		line_div.innerHTML = line_html;
    		table_cell.appendChild(line_div);
		k++;
    	    }
	    k++;
	}
	j += 2;
    }

    return table;

    // var j = 0;
    // var orc_to_id = {};

    // // add parsed lines
    // for (orc in oracles) {
    // 	var code = oracles[orc].code;
    // 	var lines = code.split(';');
    // 	for (var i = 0; i < lines.length; i++) {
    // 	    var table_cell = table.rows[i].cells[j];
    // 	    var line_html = parse_pseudocode_line(lines[i]);
    // 	    table_cell.innerHTML = line_html;
    // 	}
    // 	orc_to_id[orc] = j;
    // 	j++;
    // }

    // // add parsed header
    // if (header_val != null && header_val.length == ncols) {
    // 	var header = table.createTHead();
    // 	var row = header.insertRow(0);
    // 	for (var j = 0; j < ncols; j++) {
    // 	    var cell = row.insertCell(j);
    // 	    var params = []; // default
    // 	    var orc_sig = parse_oracle_signature(header_val[j], params);

    // 	    var orc_sig_div = document.createElement('div');
    // 	    orc_sig_div.innerHTML = orc_sig;
    // 	    orc_sig_div.setAttribute('class', 'oracle-title');
    // 	    cell.appendChild(orc_sig_div);

    // 	    // cell.innerHTML = orc_sig;
    // 	    // cell.setAttribute('class', 'oracle-title');
    // 	}

    // }

    // if (! ("annotations" in codeq)) {
    // 	return table;
    // }

    // add annotations
    // var annotations = codeq.annotations;
    // for (var ai = 0; ai < annotations.length; ai++) {
    // 	var annot = annotations[ai];

    // 	// var random_color = gen_random_color();
    // 	var random_color = '#bcbcbc';

    // 	for (orc in annot.cells) {
    // 	    if (! (orc in orc_to_id)) {
    // 		throw 2;
    // 	    }
    // 	    var j = orc_to_id[orc];
    // 	    var line_numbers = annot.cells[orc];

    // 	    for (var i = 0; i < line_numbers.length; i++) {
    // 		var l = line_numbers[i];

    // 		if (l >= nrows) {
    // 		    throw 1;
    // 		}

    // 		var cell = table.rows[l+1].cells[j];

    // 		cell.style = "background-color: " + random_color;
    // 		// cell.setAttribute('class', 'pcode-annotated-line');
    // 		var tooltip = document.createElement('div');
    // 		tooltip.setAttribute('class', 'tooltip');

    // 		var tooltiptext = document.createElement('div');
    // 		tooltiptext.setAttribute('class', 'tooltiptext');
    // 		tooltiptext.innerHTML = annot.comment;

    // 		tooltip.appendChild(tooltiptext);
    // 		cell.appendChild(tooltip);

    // 		cell.addEventListener('mouseover', function(elem, comment) {
    // 		    var tooltiptext_wrapper = document.getElementById('tooltiptext_wrapper');
    // 		    tooltiptext_wrapper.innerHTML = comment;
    // 		    tooltiptext_wrapper.style.visibility = "visible";
    // 		    tooltiptext_wrapper.style.opacity = 1;
    // 		}.bind(cell, cell, annot.comment));

    // 		cell.addEventListener('mouseout', function(elem) {
    // 		    var tooltiptext_wrapper = document.getElementById('tooltiptext_wrapper');
    // 		    tooltiptext_wrapper.style.visibility = "hidden";
    // 		    tooltiptext_wrapper.style.opacity = 0;
    // 		}.bind(cell, cell));


    // 	    }
    // 	}
    // }

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

    // This feature is annoying, commented out
    // onmouseover is problematic, use onmouseenter instead
    // proofstep_container.onmouseenter = function(val){
    // 	// highlight proofstep node in prooftree graph
    // 	var cellname = val.target.id.substr("proofstep_".length);
    // 	if (nodes_lookup != null && graph != null) {
    // 	    if (cellname in nodes_lookup) {
    // 		var cell = nodes_lookup[cellname];
    // 		graph.selectionModel.setCells([cell]);
    // 	    }
    // 	}
    // };

    // adds step name
    var step_name = document.createElement('p');
    step_name.setAttribute('class', 'proofstep-title');

    var prooftree = proof.prooftree;
    if ("longname" in prooftree[step]) {
	step_name.innerHTML = prooftree[step].longname;
    } else {
	step_name.innerHTML = step;
    }

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
		    add_proofstep_content_graphs_reduction(proofstep_container, step, graphs, proof, reduction, "reduction");

		} else if ("codeq" in type) {
		    var codeq = type.codeq;
		    var cuts = type.cuts;
		    // add_proofstep_content_graphs(proofstep_container, step, graphs, proof, codeq.graph, codeq.packages, 'codeq');
		    add_proofstep_content_graphs_reduction(proofstep_container, step, graphs, proof, cuts, "codeq");
    		    add_inlining_steps(proofstep_container, codeq);

		} else if ("plugin" in type) {
		    var plugin = type.plugin;
		    add_proofstep_content_graphs(proofstep_container, step, graphs, proof, plugin.graph, plugin.cut, 'plugin');
		} else {
		    add_proofstep_content_graphs(proofstep_container, step, graphs, proof);
		}
	    } else {
		add_proofstep_content_graphs(proofstep_container, step, graphs, proof);
	    }

	} else if ("text" in content) {
	    var text = content.text;
	    add_proofstep_content_text(proofstep_container, text);
	} else if ("def" in content) {
	    var def = content.def;

	    // var def_container = document.createElement('div');
	    // var res = add_proofstep_content_graphs(def_container, "", graphs, proof);

	    var link_container = document.createElement('div');
	    link_container.setAttribute('class', 'proofstep-text');
	    var def_container = document.createElement('div');
	    link_container.appendChild(def_container);

	    var link = document.createElement('a');
	    link.href = '#';
	    link.innerHTML = def.text;

	    link.onclick = function () {
		load_graphs_into_wrapper(def, def_container);
	    }

	    link_container.appendChild(link);
	    proofstep_container.appendChild(link_container);

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


	// // overlay
	// graph.addListener(mxEvent.CLICK, function(sender, evt) {
	//     var cell = evt.getProperty('cell');
	//     if (cell != null) {
	// 	var overlays = graph.getCellOverlays(cell);
	// 	if (overlays == null) {

	// 	    var overlay = new mxCellOverlay(
	// 		new mxImage('editors/images/overlays/check.png', 16, 16),
	// 		'Overlay tooltip');

	// 	    overlay.addListener(mxEvent.HOVER, function(sender, evt2) {					    mxUtils.alert('Overlay clicked');
	// 													    console.log('cell');										    console.log(cell.value);
	// 													    console.log(prooftree[cell.value]);

	// 								      }
	// 			       );

	// 	    graph.addCellOverlay(cell, overlay);
	// 	} else {
	// 	    graph.removeCellOverlays(cell);
	// 	}
	//     }
	// });



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

	    var result = document.querySelectorAll(`[id*="proofstep_"]`);
	    for (var i = 0; i < result.length; i++) {
		result[i].style.display = "none";
	    }

	    var target_proofstep_id = 'proofstep_' + cell.value;
	    var proofstep_div = document.getElementById(target_proofstep_id);
	    // console.log('cell.style'); 	    console.log(cell);

	    var title = proofstep_div.getElementsByClassName('proofstep-title')[0];

	    title.setAttribute('class', 'proofstep-title highlight');
	    setTimeout(function () {
	    	title.className = "proofstep-title";
	    }, 2000);

	    proofstep_div.style.display = "block";

	}
    }

    // convert_pkg_names_latex();

}

function add_def(proof, wrapper_width) {
    var proof_wrapper = document.getElementById('proof_wrapper');
    var oracle_wrapper = document.getElementById('oracle_wrapper');

    console.log(wrapper_width);
    proof_wrapper.style.width = wrapper_width.proof_width;
    oracle_wrapper.style.width = wrapper_width.oracle_width;

    var contents = proof.prooftree;

    var proof_wrapper = document.getElementById("proof_wrapper");

    // Add all contents
    for (step in contents) {
	add_proofstep(null, null, step, proof);
    }

    var pkg_defs_sofar = {};
    // Add mono defs in oracle wrapper pane
    var oracle_wrapper = document.getElementById("oracle_wrapper");
    var mono_pkgs = proof.monolithic_pkgs;

    for (pkg_name in mono_pkgs) {
	var pkg = mono_pkgs[pkg_name];
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

}

function load_graphs_into_wrapper(def, container) {
    var name = def.name;
    var link = "./stdlib/" + name + ".js";
    var script = document.createElement("script");
    script.id = "loaded_script"
    script.src = link;
    script.onload = callback = function() {
	container.innerHTML = "";
	// console.log(proof);

	add_proofstep_content_graphs(container, null, def.graphs, proof, null);

	MathJax.typeset();
        // convert_pkg_names_latex();


	document.getElementById("loaded_script").remove()

    }
    document.body.appendChild(script);

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
		var res = supsub_compiler_svg(elem, elem.innerHTML);
		elem.innerHTML = res;
	    }
	}


    }
}
