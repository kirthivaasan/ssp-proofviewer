// =========
// Callgraph
// =========
function CallGraph(graph) {
    this.graph = graph;

    this.rewrite = function(target_pkgs, callgraph) {

    }

    this.copy = function() {

    }
}

// example package json
var prf0_pkg = {
    "name": "Prf^0_f",
    "oracle_specs":
    [
	{
	    "name": "EVAL",
	    "params": ["x"],
	    "code": ""
	}

    ]
};

var keys_pkg = {
    "name": "Keys",
    "oracle_specs":
    [
	{
	    "name": "GET",
	    "params": [],
	    "code": ""
	},
	{
	    "name": "SAMPLE",
	    "params": [],
	    "code": ""
	}

    ]
};
