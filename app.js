
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

function add_proof_tree_window(wnd_height, wnd_width, wnd_x, wnd_y, prooftree) {

}

function main() {

}

main();
