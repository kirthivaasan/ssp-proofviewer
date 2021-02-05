function ggm_driver() {
    var proof_name = "GGM construction (PRG implies PRF)";

    var monolithic_pkgs = {
	"Key":
	{
	    "state": ["k"],
	    "oracles":
	    {
		"SAMPLE" :
		{
		    "params": [],
		    "code": "@if k = @bot; @> k @gets  \\{0,1\\}^\\lambda;@return k"
		}
	    }
	},

	"Mod-prf":
	{
	    "oracles":
	    {
		"EVAL" :
		{
		    "params": ["x"],
		    "code": "@assert |x| = 3; x_1||...||x_3 @gets x; y @gets \\mathsf{Gprg}\\text{-}x_{1}x_{2}x_{3}. SAMPLE(); @return y;"
		}

	    }
	},

	"Mod-Gprg^0":
	{
	    "oracles":
	    {
		"SAMPLE" :
		{
		    "params": [],
		    "code": "k_0||k_1 @gets SAMPLE();@return k"
		}
	    }

	},

	"Gprg^1":
	{
	    "oracles":
	    {
		"SAMPLE":
		{
		    "params": [],
		    "code": "@return \\{0,1\\}^\\lambda;"
		}
	    }
	},

	"Gprg-0":
	{
	    "instance": "Mod-Gprg^0"
	},
	"Gprg-000":
	{
	    "instance": "Mod-Gprg^0"
	},

	"Gprg-0^1":
	{
	    "instance": "Gprg^1"
	}



    };


    var modular_pkgs = {
	"GGM-const^0":
	{
	    "oracles": [["Mod-prf", "EVAL"]],

	    "graph":
	    {
		"Mod-prf": [["Gprg-000","SAMPLE"],["Gprg-001","SAMPLE"],["Gprg-010","SAMPLE"],["Gprg-011","SAMPLE"],["Gprg-100","SAMPLE"],["Gprg-101","SAMPLE"],["Gprg-110","SAMPLE"],["Gprg-111","SAMPLE"]],
		"Gprg-000": [["Gprg-00","SAMPLE"]],
		"Gprg-001": [["Gprg-00", "SAMPLE"]],
		"Gprg-010": [["Gprg-01", "SAMPLE"]],
		"Gprg-011": [["Gprg-01", "SAMPLE"]],
		"Gprg-100": [["Gprg-10", "SAMPLE"]],
		"Gprg-101": [["Gprg-10", "SAMPLE"]],
		"Gprg-110": [["Gprg-11", "SAMPLE"]],
		"Gprg-111": [["Gprg-11", "SAMPLE"]],
		"Gprg-00": [["Gprg-0", "SAMPLE"]],
		"Gprg-01": [["Gprg-0", "SAMPLE"]],
		"Gprg-10": [["Gprg-1", "SAMPLE"]],
		"Gprg-11": [["Gprg-1", "SAMPLE"]],
		"Gprg-0": [["Key", "SAMPLE"]],
		"Gprg-1": [["Key", "SAMPLE"]],
		"Key": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":210,"width":1,"height":50},"Mod-prf":{"x":50,"y":170,"width":50,"height":130},"Gprg-000":{"x":150, "color":"yellow","y":0,"width":90,"height":50, "color":"yellow"},"Gprg-001":{"x":150, "color":"yellow","y":60,"width":90,"height":50, "color":"yellow"},"Gprg-010":{"x":150, "color":"yellow","y":120,"width":90,"height":50, "color":"yellow"},"Gprg-011":{"x":150, "color":"yellow","y":180,"width":90,"height":50, "color":"yellow"},"Gprg-100":{"x":150, "color":"yellow","y":240,"width":90,"height":50, "color":"yellow"},"Gprg-101":{"x":150, "color":"yellow","y":300,"width":90,"height":50, "color":"yellow"},"Gprg-110":{"x":150, "color":"yellow","y":360,"width":90,"height":50, "color":"yellow"},"Gprg-111":{"x":150, "color":"yellow","y":420,"width":90,"height":50, "color":"yellow"},"Gprg-00":{"x":310,"y":30,"width":90,"height":50, "color":"yellow"},"Gprg-01":{"x":310,"y":150, "color":"yellow","width":90,"height":50, "color":"yellow"},"Gprg-10":{"x":310,"y":270,"width":90,"height":50, "color":"yellow"},"Gprg-11":{"x":310,"y":390,"width":90,"height":50, "color":"yellow"},"Gprg-0":{"x":440,"y":90,"width":90,"height":50, "color":"yellow"},"Gprg-1":{"x":440,"y":330,"width":90,"height":50, "color":"yellow"},"Key":{"x":570,"y":210,"width":90,"height":50, "color":"blue"}},"edges":{"@oracles_interface":{"Mod-prf":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Mod-prf":{"Gprg-000":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-001":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-010":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-011":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-100":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-101":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-110":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-111":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-000":{"Gprg-00":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-001":{"Gprg-00":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-010":{"Gprg-01":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-011":{"Gprg-01":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-100":{"Gprg-10":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-101":{"Gprg-10":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-110":{"Gprg-11":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-111":{"Gprg-11":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-00":{"Gprg-0":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-01":{"Gprg-0":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-10":{"Gprg-1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-11":{"Gprg-1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-0":{"Key":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-1":{"Key":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[],"Mod-prf":[],"Gprg-000":[],"Gprg-001":[],"Gprg-010":[],"Gprg-011":[],"Gprg-100":[],"Gprg-101":[],"Gprg-110":[],"Gprg-111":[],"Gprg-00":[],"Gprg-01":[],"Gprg-10":[],"Gprg-11":[],"Gprg-0":[],"Gprg-1":[]}}

	},

	"GGM-const^0-hyb1":
	{
	    "oracles": [["Mod-prf", "EVAL"]],

	    "graph":
	    {
		"Mod-prf": [["Gprg-000","SAMPLE"],["Gprg-001","SAMPLE"],["Gprg-010","SAMPLE"],["Gprg-011","SAMPLE"],["Gprg-100","SAMPLE"],["Gprg-101","SAMPLE"],["Gprg-110","SAMPLE"],["Gprg-111","SAMPLE"]],
		"Gprg-000": [["Gprg-00","SAMPLE"]],
		"Gprg-001": [["Gprg-00", "SAMPLE"]],
		"Gprg-010": [["Gprg-01", "SAMPLE"]],
		"Gprg-011": [["Gprg-01", "SAMPLE"]],
		"Gprg-100": [["Gprg-10", "SAMPLE"]],
		"Gprg-101": [["Gprg-10", "SAMPLE"]],
		"Gprg-110": [["Gprg-11", "SAMPLE"]],
		"Gprg-111": [["Gprg-11", "SAMPLE"]],
		"Gprg-00": [["Gprg-0^1", "SAMPLE"]],
		"Gprg-01": [["Gprg-0^1", "SAMPLE"]],
		"Gprg-10": [["Gprg-1^1", "SAMPLE"]],
		"Gprg-11": [["Gprg-1^1", "SAMPLE"]],
		"Gprg-0^1": [],
		"Gprg-1^1": [],
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":210,"width":1,"height":50},"Mod-prf":{"x":50,"y":170,"width":50,"height":130},"Gprg-000":{"x":150, "color":"yellow","y":0,"width":90,"height":50, "color":"yellow"},"Gprg-001":{"x":150, "color":"yellow","y":60,"width":90,"height":50, "color":"yellow"},"Gprg-010":{"x":150, "color":"yellow","y":120,"width":90,"height":50, "color":"yellow"},"Gprg-011":{"x":150, "color":"yellow","y":180,"width":90,"height":50, "color":"yellow"},"Gprg-100":{"x":150, "color":"yellow","y":240,"width":90,"height":50, "color":"yellow"},"Gprg-101":{"x":150, "color":"yellow","y":300,"width":90,"height":50, "color":"yellow"},"Gprg-110":{"x":150, "color":"yellow","y":360,"width":90,"height":50, "color":"yellow"},"Gprg-111":{"x":150, "color":"yellow","y":420,"width":90,"height":50, "color":"yellow"},"Gprg-00":{"x":310,"y":30,"width":90,"height":50, "color":"yellow"},"Gprg-01":{"x":310,"y":150, "color":"yellow","width":90,"height":50, "color":"yellow"},"Gprg-10":{"x":310,"y":270,"width":90,"height":50, "color":"yellow"},"Gprg-11":{"x":310,"y":390,"width":90,"height":50, "color":"yellow"},"Gprg-0^1":{"x":440,"y":90,"width":90,"height":50, "color":"blue"},"Gprg-1^1":{"x":440,"y":330,"width":90,"height":50, "color":"blue"}},"edges":{"@oracles_interface":{"Mod-prf":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Mod-prf":{"Gprg-000":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-001":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-010":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-011":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-100":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-101":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-110":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg-111":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-000":{"Gprg-00":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-001":{"Gprg-00":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-010":{"Gprg-01":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-011":{"Gprg-01":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-100":{"Gprg-10":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-101":{"Gprg-10":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-110":{"Gprg-11":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-111":{"Gprg-11":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-00":{"Gprg-0^1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-01":{"Gprg-0^1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-10":{"Gprg-1^1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Gprg-11":{"Gprg-1^1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[],"Mod-prf":[],"Gprg-000":[],"Gprg-001":[],"Gprg-010":[],"Gprg-011":[],"Gprg-100":[],"Gprg-101":[],"Gprg-110":[],"Gprg-111":[],"Gprg-00":[],"Gprg-01":[],"Gprg-10":[],"Gprg-11":[],"Gprg-0^1":[],"Gprg-1^1":[]}}

	},

	"GGM-const^1":
	{
	    "oracles": [["Mod-prf", "EVAL"]],

	    "graph":
	    {
		"Mod-prf": [["Gprg^1_1", "SAMPLE"], ["Gprg^1_2", "SAMPLE"], ["Gprg^1_3", "SAMPLE"], ["Gprg^1_4", "SAMPLE"], ["Gprg^1_5", "SAMPLE"], ["Gprg^1_6", "SAMPLE"], ["Gprg^1_7", "SAMPLE"], ["Gprg^1_8", "SAMPLE"]],
		"Gprg^1_1": [],
		"Gprg^1_2": [],
		"Gprg^1_3": [],
		"Gprg^1_4": [],
		"Gprg^1_5": [],
		"Gprg^1_6": [],
		"Gprg^1_7": [],
		"Gprg^1_8": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":210,"width":1,"height":50},"Mod-prf":{"x":50,"y":170,"width":50,"height":130},"Gprg^1_1":{"x":150, "color":"blue","y":0,"width":90,"height":50, "color":"blue"},"Gprg^1_2":{"x":150, "color":"blue","y":60,"width":90,"height":50, "color":"blue"},"Gprg^1_3":{"x":150, "color":"blue","y":120,"width":90,"height":50, "color":"blue"},"Gprg^1_4":{"x":150, "color":"blue","y":180,"width":90,"height":50, "color":"blue"},"Gprg^1_5":{"x":150, "color":"blue","y":240,"width":90,"height":50, "color":"blue"},"Gprg^1_6":{"x":150, "color":"blue","y":300,"width":90,"height":50, "color":"blue"},"Gprg^1_7":{"x":150, "color":"blue","y":360,"width":90,"height":50, "color":"blue"},"Gprg^1_8":{"x":150, "color":"blue","y":420,"width":90,"height":50, "color":"blue"}},"edges":{"@oracles_interface":{"Mod-prf":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Mod-prf":{"Gprg^1_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg^1_2":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg^1_3":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg^1_4":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg^1_5":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg^1_6":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg^1_7":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","Gprg^1_8":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[],"Mod-prf":[]}}

	}

    };

    var prooftree = {
	"Theorem" :
	{
	    "parent": null,
	    "contents": [
		{
		    "text": "Main theorem."
		},
		{
		    "graphs": [["GGM-const^0", "GGM-const^1"]]
		}

	    ]
	},

	"Hop1" :
	{
	    "parent": "Theorem",
	    "contents": [
		{
		    "graphs": [["GGM-const^0"], ["GGM-const^0-hyb1"]]
		},
	    ],
	    "type":
	    {
		"reduction":
		{
		    "graph": "GGM-const^0",
		    "cut": ["Mod-prf", "Gprg-000", "Gprg-001", "Gprg-010", "Gprg-011", "Gprg-100", "Gprg-101", "Gprg-110", "Gprg-111", "Gprg-00", "Gprg-01", "Gprg-10", "Gprg-11"]
		}
	    }
	},

	"Hop2" :
	{
	    "parent": "Hop1",
	    "contents": [
		{
		    "graphs": [["GGM-const^0-hyb1"]]
		},
	    ],
	    "type":
	    {
		"reduction":
		{
		    "graph": "GGM-const^0-hyb1",
		    "cut": ["Mod-prf", "Gprg-000", "Gprg-001", "Gprg-010", "Gprg-011", "Gprg-100", "Gprg-101", "Gprg-110", "Gprg-111", "Gprg-10", "Gprg-11", "Gprg-1^1"]
		}
	    }
	}

    };

    var proof = {
	"name": proof_name,
	"prooftree": prooftree,
	"monolithic_pkgs": monolithic_pkgs,
	"modular_pkgs": modular_pkgs
    }

    var wnd_width = 400;
    var wnd_height = 600;
    var wnd_x = (window.innerWidth - wnd_width) - wnd_width/9;
    var wnd_y = window.innerHeight - wnd_height;

    var wnd_pos = {wnd_height: 300, width: wnd_width, x: wnd_x, y: wnd_y}
    var wrapper_width = {proof_width: '53%', oracle_width: '30%'}
    add_proof(proof, wnd_pos, wrapper_width);


}

ggm_driver();
