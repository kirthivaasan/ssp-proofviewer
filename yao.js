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

	"GB":
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

	"KEYS1":
	{
	    "instance": "KEYS"
	},

	"KEYS2":
	{
	    "instance": "KEYS"
	}


    };



    var modular_pkgs = {
	"Gyao-sec^0":
	{
	    "oracles": [["KEYS1", "SETBIT"],["KEYS1", "GETA^{out}"],["GB", "GBL_{1..d}"],["KEYS2", "GETKEYS^{in}"]],

	    "graph":
	    {
		"GB": [["KEYS1","SETKEYS^{in}"],["KEYS2","SETKEYS^{out}"]],
		"KEYS1": [],
		"KEYS2": []
	    },

	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":30,"height":110},"GB":{"x":100,"y":30,"width":90,"height":40},"KEYS1":{"x":320,"y":10,"width":90,"height":40},"KEYS2":{"x":320,"y":60,"width":90,"height":40}},"edges":{"@oracles_interface":{"KEYS1":"exitX=1;exitY=0.2;entryX=0;entryY=0.2;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS2":"exitX=1;exitY=0.8;entryX=0.2;entryY=0.6;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB":{"KEYS1":"exitX=0.8;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS2":"exitX=0.8;exitY=0.6;entryX=0.2;entryY=0.4;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}}
	    }
	}
    };

    var prooftree = {
	"Theorem" :
	{
	    "parent": null,
	    "contents": [
		{
		    "graphs": [["Gyao-sec^0"]]
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
