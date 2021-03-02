function nprfs_mls_driver() {
    var proof_name = "GGM construction (PRG implies PRF)";

    var monolithic_pkgs = {
	"Key":
	{
	    "state": ["k"],
	    "oracles":
	    {
		"Set" :
		{
		    "params": ["idx", "k", "hon"],
		    "code": "@if Q[idx],H[idx] = k,hon :;@> @return (); @assert Q[idx] = \\bot; Q[idx] @gets k; H[idx] @gets hon; @if b_{\\mathsf{Ind}} \\wedge H[idx]: K[idx] @sample \\{0,1\\}^{|k|}; else : K[idx] @gets k;"
		},
		"Get" :
		{
		    "params": ["idx"],
		    "code": ""
		}

	    }
	},

	"Key^{10}":
	{
	    "instance": "Key"
	},

	"Key^{00}":
	{
	    "instance": "Key"
	},

	"Key^{b0}":
	{
	    "instance": "Key"
	}
    };


    var modular_pkgs = {
	"NPRF":
	{
	    "oracles": [["Key^{10}", "Set"], ["MOD-NPRF", "Eval"], ["Key^{b0}", "Get"]],

	    "graph":
	    {
		"PRF": [["Key^{10}", "Get"],["Key^{00}", "Set"]],
		"XOR": [["Key^{00}", "Get"], ["Key^{b0}", "Set"]],
		"MOD-NPRF": [["PRF", "Eval"], ["XOR", "XOR"]],
		"Key^{10}": [],
		"Key^{00}": [],
		"Key^{b0}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":-10,"y":0,"width":10,"height":190},"PRF":{"x":130,"y":40,"width":60,"height":50},"XOR":{"x":130,"y":100,"width":60,"height":50},"MOD-NPRF":{"x":60,"y":30,"width":30,"height":130},"Key^{10}":{"x":240,"y":10,"width":90,"height":50},"Key^{00}":{"x":240,"y":70,"width":90,"height":50},"Key^{b0}":{"x":240,"y":130,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{10}":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","MOD-NPRF":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Key^{b0}":"exitX=0.75;exitY=0.7;entryX=0.1;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}":"exitX=0.75;exitY=0.4;entryX=0.05;entryY=0.85;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.85;exitY=0.7;entryX=0;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"XOR":{"Key^{00}":"exitX=0.85;exitY=0.3;entryX=0;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{b0}":"exitX=0.6;exitY=0.55;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"MOD-NPRF":{"PRF":"exitX=0.95;exitY=0.3;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","XOR":"exitX=0.6;exitY=0.55;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XOR":[],"MOD-NPRF":[]}}
	},

    };

    var game_defs = {

    };

    var prooftree = {
	"node1" :
	{
	    "parent": null,
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs": [["NPRF", "NPRF", "NPRF", "NPRF"]]
		}
	    ]
	}
    };

    var proof = {
	"name": proof_name,
	"prooftree": prooftree,
	"game_defs": game_defs,
	"monolithic_pkgs": monolithic_pkgs,
	"modular_pkgs": modular_pkgs
    }

    var wnd_width = 600;
    var wnd_height = 300;
    var wnd_x = (window.innerWidth - wnd_width) - wnd_width/9;
    var wnd_y = window.innerHeight - wnd_height;

    var wnd_pos = {wnd_height: 300, width: wnd_width, x: wnd_x, y: wnd_y}
    var wrapper_width = {proof_width: '73%', oracle_width: '25%'}
    add_proof(proof, wnd_pos, wrapper_width);


}

nprfs_mls_driver();
