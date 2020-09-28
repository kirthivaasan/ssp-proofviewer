function eqSet(as, bs) { // https://stackoverflow.com/questions/31128855/comparing-ecma6-sets-for-equality
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}

function eqArray(ar, br) {
    if (ar.length !== br.length) return false;
    for (var a of ar) if (!br.includes(a)) return false;
    return true;
}

// =========
// Callgraph
// =========
function CallGraph(pkg_data) {
    // Error classes
    class OracleValidationError extends Error {
	constructor(message) {
	    super(message);
	    this.name = "OracleValidationError";
	}
    }

    class PackageCollisionError extends Error {
	constructor(message) {
	    super(message);
	    this.name = "PackageCollisionError";
	}
    }

    class UndefinedPackageError extends Error {
	constructor(message) {
	    super(message);
	    this.name = "UndefinedPackageError";
	}
    }

    class InvalidCutError extends Error {
	constructor(message) {
	    super(message);
	    this.name = "InvalidCutError";
	}
    }

    class InterfaceMismatchError extends Error {
	constructor(message) {
	    super(message);
	    this.name = "InterfaceMismatchError";
	}
    }

    this.graph = pkg_data.graph;

    this.isValidOracles = function(oracles) {
	var pkgs = oracles.filter(e => (e[0] in pkg_data.graph) == false);
	return pkgs.length == 0;
    }

    if (!this.isValidOracles(pkg_data.oracles)) {
	throw new OracleValidationError('Not valid oracles');
    }

    this.oracles = pkg_data.oracles;

    this.deps = [];

    this.getReverseGraph = function() {
	var g = {};
	for (node in this.graph) {
	    g[node] = [];
	}

	for (node in this.graph) {
	    var nbs = this.graph[node];
	    for (var i = 0; i < nbs.length; i++) {
		var nb = nbs[i][0];
		var oracle = nbs[i][1];
		if (nb in this.graph) {
		    g[nb].push([node, oracle]);
		} else {
		    this.deps.push([nb, oracle]);
		}
	    }
	}
	return g;

    }

    this.reverse_graph = this.getReverseGraph();

    this.getRoot = function() {
	for (pkg in this.reverse_graph) {
	    if (this.reverse_graph[pkg].length == 0) {
		return pkg;
	    }
	}
	return -1;
    }

    this.root = this.getRoot();

    this.getOracles = function(pkg) {
	if (pkg in this.reverse_graph) {
	    // oracles may also be defined in this.oracles
	    var l = this.oracles.filter(e => e[0] == pkg);
	    if (l.length > 0) {
		return this.reverse_graph[pkg].concat(l);
	    }
	    return this.reverse_graph[pkg];
	}
	throw new UndefinedPackageError('[getOracles()] Could not find pkg (' + pkg + ') in callgraph.');
    }

    this.getDependencies = function(pkg) {
	if (pkg in this.graph) {
	    return this.graph[pkg];
	}
	throw new UndefinedPackageError('[getDependencies()] Could not find pkg (' + pkg + ') in callgraph.');
    }

    this.isValidCut = function(cut) {
	// check if cut pkgs are in the graph
	for (var i = 0; i < cut.length; i++) {
	    if (!(cut[i] in this.graph)) {
		return false;
	    }
	}
	return true;
    }

    this.getCutOracles = function(cut) {
	if (this.isValidCut(cut)) {
	    var cut_oracles = [];
	    for (var i = 0; i < cut.length; i++) {
		var pkg = cut[i];
		try {
		    var orcs = this.getOracles(pkg);
		    cut_oracles = cut_oracles.concat(orcs);
		} catch (err) {
		    throw err;
		}
	    }
	    return cut_oracles;
	} else {
	    throw new InvalidCutError('The cut (' + cut + ') is invalid on callgraph.');
	}
    }

    this.getCutDependencies = function(cut) {
	if (this.isValidCut(cut)) {
	    var cut_deps = [];
	    for (var i = 0; i < cut.length; i++) {
		var pkg = cut[i];
		try {
		    var deps = this.getDependencies(pkg);
		    cut_deps = cut_deps.concat(deps);
		} catch (err) {
		    throw err;
		}
	    }
	    return cut_deps;
	} else {
	    throw new InvalidCutError('The cut (' + cut + ') is invalid on callgraph.');
	}
    }

    this.copy = function () { // deep copy callgraph
	var g = {};
	for (pkg in this.graph) {
	    var nbs_copy = [];
	    var nbs = this.graph[pkg];
	    for (var i = 0; i < nbs.length; i++) {
		nbs_copy.push(nbs[i]);
	    }
	    g[pkg] = nbs_copy;
	}

	var oracles = [];
	for (var i = 0; i < this.oracles.length; i++) {
	    oracles.push(this.oracles[i]);
	}

	return new CallGraph({"oracles": oracles, "graph": g});
    }

    // checks if there is a pkg collision with another callgraph
    this.hasPackageCollision = function(cg) {
	for (pkg in cg.graph) {
	    if (pkg in this.graph) {
		return true;
	    }
	}
	return false;
    }

    // check if interfaces of cut on this graph matches with cg
    this.cutInterfacesMatch = function(cut, cg) {
	var cg_oracles = new Set(cg.oracles.map(e => e[1], []));
	var cg_deps = new Set(cg.deps.map(e => e[1], []));

	var oracles = null;
	var deps = null;

	try {
	    oracles = this.getCutOracles(cut);
	    deps = this.getCutDependencies(cut);
	} catch (err) {
	    console.log(err.name + ' : ' + err.message);
	    return false;
	}

	oracles = new Set(oracles.map(e => e[1], []));
	deps = new Set(deps.map(e => e[1], []));

	return eqSet(cg_oracles, oracles) && eqSet(cg_deps, deps);

    }

    this.rewrite = function(cut, cg) {
	if (this.hasPackageCollision(cg)) {
	    throw new PackageCollisionError('Callgraphs have package name collision.');
	}

	if (! this.cutInterfacesMatch(cut, cg)) {
	    throw new InterfaceMismatchError('Interfaces of cut and graph don\'t match.');
	}

	var g = {};

	var cg_oracles = cg.oracles;
	var cg_deps = cg.deps;

	var cut_oracles = this.getCutOracles(cut);
	var cut_deps = this.getCutDependencies(cut);


	var lookup = {};

	for (var i = 0; i < cg_oracles.length; i++) {
	    var nb = cg_oracles[i];
	    lookup[nb[1]] = nb[0];
	}

	// update this.oracles
	var new_oracles = [];
	for (var i = 0; i < this.oracles.length; i++) {
	    var element = this.oracles[i];
	    if (cut.includes(element[0])) {
		var orc = element[1];
		var orc_pkg = lookup[orc];
		new_oracles.push([orc_pkg, orc]);
	    } else {
		new_oracles.push(element);
	    }
	}

	this.oracles = new_oracles;

	for (pkg in this.graph) {
	    if (cut.includes(pkg)) {
		delete this.graph[pkg];
	    } else {
		var nbs = this.graph[pkg];
		var nbs_copy = [];
		for (var i = 0; i < nbs.length; i++) {
		    var nb = nbs[i];
		    if (cut.includes(nb[0])) {
			var orc = nb[1];
			var pkg_orc = lookup[orc];
			nbs_copy.push([pkg_orc, orc]);
		    } else {
			nbs_copy.push(nb);
		    }
		}
		g[pkg] = nbs_copy;

	    }
	}

	for (pkg in cg.graph) {
	    g[pkg] = cg.graph[pkg];
	}

	// copy this.oracles
	var oracles_copy = [];
	for (var i = 0; i < this.oracles.length; i++) {
	    var el = this.oracles[i];
	    oracles_copy.push([el[0], el[1]]);
	}

	return {"oracles": oracles_copy, "graph": g};

    }
}

function graphsEqual(g1, g2) {
    var g1_oracles = new Set(g1.oracles.map(e => e[0] + '.' + e[1], []));
    var g2_oracles = new Set(g2.oracles.map(e => e[0] + '.' + e[1], []));

    if (!eqSet(g1_oracles, g2_oracles)) {
	return false;
    }

    for (pkg in g1.graph) {
	if (! (pkg in g2.graph) ) {
	    return false;
	}

	// serialize ["<node>", "<edge>"] into strings for Set
	// in order for value equality instead of ref eq.
	var g1_nbs = g1.graph[pkg].map(e => e[0] + '.' + e[1]);
	var g2_nbs = g2.graph[pkg].map(e => e[0] + '.' + e[1]);

	var g1_nbs = new Set(g1_nbs);
	var g2_nbs = new Set(g2_nbs);

	var eq_nbs = eqSet(g1_nbs, g2_nbs);

	if (! eq_nbs) {
	    return false;
	}

    }

    return true;
}



function test_rewrite(pkg1, pkg2, cut, expected) {
    try {
	var cg1 = new CallGraph(pkg1);
	var cg2 = new CallGraph(pkg2);
	console.log('============\nREWRITE TEST\n============');
	console.log('pkg1: ', JSON.stringify(pkg1));
	console.log('pkg2: ', JSON.stringify(pkg2));
	console.log('cut: ', cut);
	try {
	    var res = cg1.rewrite(cut, cg2);

	    console.log('Rewrite result: ' + JSON.stringify(res));
	    console.log('Rewrite expect: ' + JSON.stringify(expected));

	    return graphsEqual(res, expected);
	} catch (re_err) {
	    console.log('[REWRITE] error: ' + re_err.name + ' | ' + re_err.message);
	}
    } catch (err) {
	console.log('[CREATING CALLGRAPH] error: ' + err.name + ' | ' + err.message);
    }
}

// tests
function rewrite_test1() {
    var pkg1 = {
	"oracles":[["b", "GET"]],
	"graph":
	{
	    "b": [["c", "SET"]],
	    "c": []
	}
    };

    var pkg2 = {
	"oracles":[["d", "GET"]],
	"graph":
	{
	    "d": [["e", "CALL"], ["c", "SET"]],
	    "e": []
	}
    };

    var b_rewrite = {
	"oracles":[["d", "GET"]],
	"graph":
	{
	    "d": [["e", "CALL"], ["c", "SET"]],
	    "e": [],
	    "c": []
	}
    }

    return test_rewrite(pkg1, pkg2, ["b"], b_rewrite);
}

function rewrite_test2() {
    var pkg1 = {
	"oracles":[["b", "ENC"], ["z", "CALL"]],
	"graph":
	{
	    "b": [["c", "SET"]],
	    "z": [["c", "GET"]],
	    "c": []
	}
    };

    var pkg2 = {
	"oracles":[["d", "CALL"]],
	"graph":
	{
	    "d": [["e", "CALL"], ["c", "GET"]],
	    "e": []
	}
    };

    var z_rewrite = {
	"oracles":[["b", "ENC"], ["d", "CALL"]],
	"graph":
	{
	    "b": [["c", "SET"]],
	    "d": [["e", "CALL"], ["c", "GET"]],
	    "e": [],
	    "c": []
	}
    };

    return test_rewrite(pkg1, pkg2, ["z"], z_rewrite);
}

function rewrite_test3() {
    var pkg1 = {
	"oracles":[["b", "ENC"], ["m", "CALL"], ["m", "CALL2"]],
	"graph":
	{
	    "b": [["c", "SET"]],
	    "m": [["c", "GET"]],
	    "c": []
	}
    };

    var pkg2 = {
	"oracles":[["d", "CALL"], ["d", "CALL2"]],
	"graph":
	{
	    "d": [["c", "GET"], ["e", "CALL"]],
	    "e": []
	}
    };

    var m_rewrite = {
	"oracles":[["b", "ENC"], ["d", "CALL"], ["d", "CALL2"]],
	"graph":
	{
	    "b": [["c", "SET"]],
	    "d": [["e", "CALL"], ["c", "GET"]],
	    "e": [],
	    "c": []
	}
    };

    return test_rewrite(pkg1, pkg2, ["m"], m_rewrite);
}

function rewrite_test4() {
    var pkg1 = {
	"oracles":[["b", "ENC"], ["m", "CALL"]],
	"graph":
	{
	    "b": [["c", "SET"]],
	    "m": [["c", "GET"]],
	    "c": []
	}
    };

    var pkg2 = {
	"oracles":[["d", "CALL"]],
	"graph":
	{
	    "d": [["e", "CALL"]],
	    "e": [["c", "GET"]]
	}
    };

    var m_rewrite = {
	"oracles":[["b", "ENC"], ["d", "CALL"]],
	"graph":
	{
	    "b": [["c", "SET"]],
	    "d": [["e", "CALL"]],
	    "e": [["c", "GET"]],
	    "c": []
	}
    };

    return test_rewrite(pkg1, pkg2, ["m"], m_rewrite);
}

function rewrite_test5() {
    var pkg1 = {
	"oracles":[["b", "ENC"], ["m", "CALL"]],
	"graph":
	{
	    "b": [["c", "SET"]],
	    "m": [["c", "GET"]],
	    "c": []
	}
    };

    var pkg2 = {
	"oracles":[["d", "CALL"], ["d", "ENC"]],
	"graph":
	{
	    "d": [["e", "CALL"], ["c", "GET"], ["c", "SET"]],
	    "e": []
	}
    };

    var m_rewrite = {
	"oracles":[["d", "ENC"], ["d", "CALL"]],
	"graph":
	{
	    "d": [["e", "CALL"], ["c", "GET"], ["c", "SET"]],
	    "e": [],
	    "c": []
	}
    };

    return test_rewrite(pkg1, pkg2, ["b", "m"], m_rewrite);
}

function rewrite_test6() {
    var pkg1 = {
	"oracles":[["a", "CALL2"], ["b", "ENC"], ["m", "CALL"]],
	"graph":
	{
	    "a": [["b", "ENC"]],
	    "b": [["c", "SET"]],
	    "m": [["c", "GET"]],
	    "c": []
	}
    };

    var pkg2 = {
	"oracles":[["d", "CALL"], ["d", "ENC"]],
	"graph":
	{
	    "d": [["e", "CALL"], ["c", "GET"], ["c", "SET"]],
	    "e": []
	}
    };

    var m_rewrite = {
	"oracles":[["a", "CALL2"], ["d", "ENC"], ["d", "CALL"]],
	"graph":
	{
	    "a": [["d", "ENC"]],
	    "d": [["e", "CALL"], ["c", "GET"], ["c", "SET"]],
	    "e": [],
	    "c": []
	}
    };

    return test_rewrite(pkg1, pkg2, ["b", "m"], m_rewrite);
}

function tests_driver() {
    console.log('rewrite_test1 result: ' + rewrite_test1());
    console.log('rewrite_test2 result: ' + rewrite_test2());
    console.log('rewrite_test3 result: ' + rewrite_test3());
    console.log('rewrite_test4 result: ' + rewrite_test4());
    console.log('rewrite_test5 result: ' + rewrite_test5());
    console.log('rewrite_test6 result: ' + rewrite_test6());
}

// tests_driver();

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
