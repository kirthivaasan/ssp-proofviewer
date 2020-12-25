function yao_driver() {
    var proof_name = "Game-based security and simulation-based security equivalence of IND-CPA for symmetric encryption";

    var monolithic_pkgs = {
	"KEYS":
	{
	    "oracles":
	    {
		"SETBIT" :
		{
		    "code": "",
		    "params": []
		},

		"GETA^{out}" :
		{
		    "code": "",
		    "params": []
		},

		"SETKEYS^{in}" :
		{
		    "code": "",
		    "params": []
		},

		"SETKEYS^{out}" :
		{
		    "code": "",
		    "params": []
		}
	    }

	},

	"GB_{yao}":
	{
	    "oracles":
	    {
		"GBL_{1..d}" :
		{
		    "code": "",
		    "params": []
		}
	    }

	},

	"KEYS_1":
	{
	    "instance": "KEYS"
	},

	"KEYS_2":
	{
	    "instance": "KEYS"
	}


    };



    var modular_pkgs = {
	"Gyao-sec^0":
	{
	    "oracles": [["KEYS_1", "SETBIT"],["KEYS_1", "GETA^{out}"],["GB_{yao}", "GBL_{1..d}"],["KEYS_2", "GETKEYS^{in}"]],

	    "graph":
	    {
		"GB_{yao}": [["KEYS_1","SETKEYS^{in}"],["KEYS_2","SETKEYS^{out}"]],
		"KEYS_1": [],
		"KEYS_2": []
	    },

	    "layout":
	    {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":140},"GB_{yao}":{"x":100,"y":50,"width":90,"height":40},"KEYS_1":{"x":320,"y":20,"width":90,"height":40},"KEYS_2":{"x":320,"y":80,"width":90,"height":40}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=1;exitY=0.2;entryX=0;entryY=0.2;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB_{yao}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_2":"exitX=1;exitY=0.8;entryX=0.2;entryY=0.6;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB_{yao}":{"KEYS_1":"exitX=0.8;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS_2":"exitX=0.8;exitY=0.6;entryX=0.2;entryY=0.4;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}}
	    }
	},

	"Gyao-sec^1":
	{
	    "oracles": [["BITS","SETBIT"],["BITS","GETA^{out}"],["SIM","GBL_{1..d}"],["KEYS","GETKEYS^{in}"]],
	    "graph":
	    {
		"EV": [["BITS","GETBIT"],["KEYS","SETBIT"]],
		"SIM": [["EV","EVAL"],["KEYS","GETA^{out}"]],
		"KEYS": [],
		"BITS": []
	    },
	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":140},"EV":{"x":360,"y":50,"width":90,"height":40},"SIM":{"x":90,"y":40,"width":90,"height":60},"KEYS":{"x":510,"y":90,"width":90,"height":40},"BITS":{"x":510,"y":10,"width":90,"height":40}},"edges":{"@oracles_interface":{"BITS":"exitX=1;exitY=0.2;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","SIM":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"entryX=0.2;entryY=0.6;entryDx=0;entryDy=0;exitX=1;exitY=0.8;exitDx=0;exitDy=0;"},"EV":{"BITS":"exitX=0.8;exitY=0.4;entryX=0;entryY=0.8;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS":"exitX=0.8;exitY=0.6;entryX=0;entryY=0.2;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"SIM":{"EV":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.8;exitY=0.6;exitDx=0;exitDy=0;entryX=0;entryY=0.4;entryDx=0;entryDy=0;"}}
	    }
	}
    };

    var prooftree = {
	"Theorem" :
	{
	    "parent": null,
	    "contents": [
		{
		    "graphs": [["Gyao-sec^0"], ["Gyao-sec^1"]]
		},
	    ]
	}

    };

    var proof = {
	"name": proof_name,
	"prooftree": prooftree,
	"monolithic_pkgs": monolithic_pkgs,
	"modular_pkgs": modular_pkgs
    }

    var wnd_width = 300;
    var wnd_height = 300;
    var wnd_x = (window.innerWidth - wnd_width) - wnd_width/10;
    var wnd_y = window.innerHeight - wnd_height;

    var wnd_pos = {wnd_height: 300, width: wnd_width, x: wnd_x, y: wnd_y}
    var wrapper_width = {proof_width: '51%', oracle_width: '30%'}
    add_proof(proof, wnd_pos, wrapper_width);


}

yao_driver();
