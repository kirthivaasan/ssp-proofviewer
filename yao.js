function yao_driver() {
    var proof_name = "Game-based security and simulation-based security equivalence of IND-CPA for symmetric encryption";

    var monolithic_pkgs = {
	"KEYS":
	{
	    "oracles":
	    {
		"SETBIT" :
		{
		    "code": "@assert z_j = @bot;z_j @gets z;@return ();",
		    "params": ["j", "z"]
		},

		"GETBIT" :
		{
		    "code": "@assert z_j \\neq @bot; ;@return z_j",
		    "params": ["j"]
		},

		"GETA^{out}" :
		{
		    "code": "@assert z_j \\neq @bot;\\mathsf{aflag} @gets 1;@if Z_j = @bot @then;    Z_j(0) @sample \\{0,1\\}^\\lambda;    Z_j(1) @sample \\{0,1\\}^\\lambda;@return Z_j(z_j);",
		    "params": ["j"]
		},

		"GETA^{in}" :
		{
		    "code": "@assert z_j \\neq @bot;@assert \\mathsf{aflag} = 1;@assert Z_j @neq @bot;@return Z_j(z_j);",
		    "params": ["j"]
		},

		"GETKEYS^{in}" :
		{
		    "code": "@assert z_j @neq @bot;@return z_j;",
		    "params": ["j"]
		},

		"GETKEYS^{out}" :
		{
		    "code": "@assert z_j = @bot;z_j @gets z;@return ();",
		    "params": ["j", "z"]
		}
	    }

	},


	"MODGB":
	{
	    "oracles":
	    {
		"GBL" :
		{
		    "params": ["\\ell", "r", "op", "j"],
		    "code": "@assert \\tilde{C} \\neq @bot;@assert \\ell, r, op @neq @bot;@assert |\\ell|, |r|, |op| = n;@for j = 1..n @do;    (\\ell,r,op)  @gets  (\\ell(j),r(j),op(j));    \\tilde{C}_j @gets DENC(\\ell,r,op);\\tilde{C} @gets \\tilde{C}_{1..n};@return \\tilde{C};"
		}
	    }

	},

	"MODGB_i":
	{
	    "instance": "MODGB"
	},


	"MODDENC":
	{
	    "oracles":
	    {
		"DENC" :
		{
		    "code": "\\tilde{g}_j @gets @bot;Z_j^{out} @gets GETKEYS^{out}(j);@for (b_{\\ell},b_r) \\in \\{0,1\\}^2 @do;@> b_j @gets op(b_{\\ell}, b_r);@> k^0_j @gets Z^{out}_j(b_j);@> c^0_{in} @gets ENC(b^{\\ell},k^0_j,0^\\lambda);@> c^1_{in} @gets ENC(b^{\\ell},0^\\lambda,0^\\lambda);@> c @sample ENC(b^r, c^0_{in}, c^1_{in});@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j;",
		    "params": ["\\ell", "r", "op", "j"]
		}
	    }

	},

	"SIM_{denc}":
	{
	    "oracles":
	    {
		"DENC" :
		{
		    "code": "\\tilde{g}_j @gets @bot;EVAL(j,\\ell,r,op);S_j^{out}(0) @gets GETA^{out}(j);S_r^{in}(0) @gets GETA^{in}(r);S_r^{in}(1) @gets GETINA^{in}(r);S_{\\ell}^{in}(0) @gets GETA^{in}(\\ell);S_{\\ell}^{in}(1) @gets GETINA^{in}(\\ell);@for (d_{\\ell},d_r) \\in \\{0,1\\}^2 @do;@> @if d_{\\ell} = d_r = 0 @then;@> @> k_j @gets S^{out}_j(0);@> @else k_j @gets 0^{\\lambda};@> k_r @gets S^{in}_r(d_r);@> c_{in} @sample enc_{k_r}(k_j);@> k_{\\ell} @gets S^{in}_{\\ell}(d_{\\ell});@> c @sample enc_{k_{\\ell}}(c_{in});@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j;",
		    "params": ["\\ell", "r", "op", "j"]
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

	"GB^0_{yao}":
	{
	    "oracles":
	    {
		"GBL" :
		{
		    "code": "",
		    "params": []
		}
	    }

	},

	"GB^1_{yao}":
	{
	    "oracles":
	    {
		"GBL" :
		{
		    "code": "",
		    "params": []
		}
	    }

	},

	"AKEYS":
	{
	    "oracles":
	    {
		"GETA^{in}" :
		{
		    "code": "",
		    "params": []
		},

		"GETINA^{in}" :
		{
		    "code": "",
		    "params": []
		},

		"GETA^{out}" :
		{
		    "code": "",
		    "params": []
		}

	    }

	},


	"ENC^0":
	{
	    "oracles":
	    {
		"ENC" :
		{
		    "code": "Z^{in} @gets GETKEYS^{in}();k @gets Z^{in}(b');c @sample enc_k(t^0);@return c;",
		    "params": ["b'", "t^0", "t^1"]
		}
	    }

	},

	"ENC^0_{1..n}":
	{
	    "instance": "ENC^0"
	},

	"ENC^1":
	{
	    "oracles":
	    {
		"ENC" :
		{
		    "code": "Z^{in} @gets GETKEYS^{in}();z @gets GETBIT();k @gets Z^{in}(b');@if b' \\neq z @then;    c @sample enc_k(t^1);c @sample enc_k(t^0);@return c;",
		    "params": ["b'", "t^0", "t^1"]
		}
	    }

	},

	"ENC^1_{1..n}":
	{
	    "instance": "ENC^1"
	},


	"BITS":
	{
	    "oracles":
	    {
		"CHECK" :
		{
		    "code": "@assert z_j \\neq @bot;",
		    "params": ["j"]
		},

		"GETBIT" :
		{
		    "code": "@assert z_j \\neq @bot; ;@return z_j",
		    "params": ["j"]
		},

		"SETBIT" :
		{
		    "code": "@assert z_j = @bot;z_j @gets z;@return ();",
		    "params": ["j", "z"]
		}

	    }

	},


	"BITS_1":
	{
	    "instance": "BITS"
	},

	"BITS_2":
	{
	    "instance": "BITS"
	},

	"BITS_3":
	{
	    "instance": "BITS"
	},

	"BITS_d":
	{
	    "instance": "BITS"
	},


	"EV":
	{
	    "oracles":
	    {
		"EVAL" :
		{
		    "code": "z^{in}_{\\ell} @gets GETBIT(\\ell);z^{in}_{r} @gets GETBIT(r);z^{out}_{j} @gets op(z^{in}_{\\ell}, z^{in}_{r});SETBIT(j, z^{out}_{j});@return ();",
		    "params": ["j", "\\ell", "r", "op"]
		}

	    }

	},

	"EV_1":
	{
	    "instance": "EV"
	},

	"EV_2":
	{
	    "instance": "EV"
	},


	"EV_d":
	{
	    "instance": "EV"
	},



	"AKEYS_1":
	{
	    "instance": "AKEYS"
	},

	"AKEYS_2":
	{
	    "instance": "AKEYS"
	},

	"AKEYS_3":
	{
	    "instance": "AKEYS"
	},

	"AKEYS_d":
	{
	    "instance": "AKEYS"
	},




	"GB^0_{yao,1}":
	{
	    "instance": "GB^0_{yao}"
	},

	"GB^0_{yao,2}":
	{
	    "instance": "GB^0_{yao}"
	},

	"GB^0_{yao,3}":
	{
	    "instance": "GB^0_{yao}"
	},

	"GB^0_{yao,d}":
	{
	    "instance": "GB^0_{yao}"
	},



	"GB^1_{yao,1}":
	{
	    "instance": "GB^1_{yao}"
	},

	"GB^1_{yao,2}":
	{
	    "instance": "GB^1_{yao}"
	},

	"GB^1_{yao,i-1}":
	{
	    "instance": "GB^1_{yao}"
	},

	"GB^1_{yao,i}":
	{
	    "instance": "GB^1_{yao}"
	},

	"GB^0_{yao,i+1}":
	{
	    "instance": "GB^0_{yao}"
	},

	"GB^0_{yao,i+2}":
	{
	    "instance": "GB^0_{yao}"
	},


	"GB^1_{yao,d}":
	{
	    "instance": "GB^1_{yao}"
	},



	"KEYS_0":
	{
	    "instance": "KEYS"
	},

	"KEYS_1":
	{
	    "instance": "KEYS"
	},

	"KEYS_2":
	{
	    "instance": "KEYS"
	},

	"KEYS_3":
	{
	    "instance": "KEYS"
	},

	"KEYS_{i-1}":
	{
	    "instance": "KEYS"
	},

	"KEYS_i":
	{
	    "instance": "KEYS"
	},

	"KEYS_{i+1}":
	{
	    "instance": "KEYS"
	},

	"KEYS_{i+2}":
	{
	    "instance": "KEYS"
	},

	"KEYS_{i+3}":
	{
	    "instance": "KEYS"
	},

	"KEYS_{d-1}":
	{
	    "instance": "KEYS"
	},

	"KEYS_{d}":
	{
	    "instance": "KEYS"
	},

	"KEYS_d":
	{
	    "instance": "KEYS"
	}


    };


    var modular_pkgs = {
	"SEC^0(GB_{yao})":
	{
	    "oracles": [["KEYS_1", "SETBIT"],["KEYS_1", "GETA^{out}"],["GB_{yao}", "GBL_{1..d}"],["KEYS", "GETKEYS^{in}"]],

	    "graph":
	    {
		"GB_{yao}": [["KEYS_1","GETKEYS^{in}"],["KEYS","GETKEYS^{out}"]],
		"KEYS_1": [],
		"KEYS": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":110},"GB_{yao}":{"x":120,"y":30,"width":90,"height":50},"KEYS_1":{"x":320,"y":0,"width":90,"height":50},"KEYS":{"x":320,"y":60,"width":90,"height":50}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=0.95;exitY=0.15;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB_{yao}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"entryX=0;entryY=0.8;exitX=0.8;exitY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB_{yao}":{"KEYS_1":"exitX=0.85;exitY=0.3;entryX=0;entryY=0.8;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS":"exitX=0.85;exitY=0.7;entryX=0;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[],"GB_{yao}":[]}}
	},

	"SEC^1(SIM_{yao})":
	{
	    "oracles": [["BITS", "SETBIT"], ["SIM_{yao}", "GETA^{out}"], ["SIM_{yao}", "GBL_{1..d}"], ["KEYS", "GETKEYS"]],
	    "graph":
	    {
		"SIM_{yao}": [["BITS", "CHECK_1"], ["EV_{1..d}", "CHECK_{2..d}"], ["EV_{1..d}", "EVAL_{1..d}"], ["KEYS", "GETA^{out}"]],
		"EV_{1..d}": [["BITS", "GETBIT"], ["KEYS", "SETBIT"]],
		"BITS": [],
		"KEYS": []
	    },
	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":110},"SIM_{yao}":{"x":100,"y":30,"width":90,"height":50},"EV_{1..d}":{"x":340,"y":30,"width":90,"height":50},"BITS":{"x":510,"y":0,"width":90,"height":50},"KEYS":{"x":510,"y":60,"width":90,"height":50}},"edges":{"@oracles_interface":{"BITS":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","SIM_{yao}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.75;exitY=0.7;exitDx=0;exitDy=0;entryX=0;entryY=0.8;entryDx=0;entryDy=0;"},"SIM_{yao}":{"BITS":"exitX=0.75;exitY=0.35;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_{1..d}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.85;exitY=0.7;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"EV_{1..d}":{"BITS":"exitX=0.65;exitY=0.4;entryX=0;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS":"exitX=0.85;exitY=0.7;entryX=0.1;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"SIM_{yao}":[{"x":200,"y":80}],"EV_{1..d}":[]}}
	},

	"SEC^0(GB_{yao})-unrolled":
	{
	    "oracles": [["KEYS_1","SETBIT"],["KEYS_1","GETA^{out}"],["GB^0_{yao,1}","GBL_1"],["GB^0_{yao,2}","GBL_2"], ["GB^0_{yao,3}","GBL_3"], ["GB^0_{yao,d}","GBL_d"], ["KEYS", "GETKEYS^{in}"]],
	    "graph":
	    {
		"KEYS_1": [],
		"KEYS_2": [],
		"KEYS_3": [],
		"KEYS_4": [],

		"GB^0_{yao,1}": [["KEYS_1","GETKEYS^{in}"],["KEYS_2","GETKEYS^{out}"]],
		"GB^0_{yao,2}": [["KEYS_2","GETKEYS^{in}"],["KEYS_3","GETKEYS^{out}"]],
		"GB^0_{yao,3}": [["KEYS_3","GETKEYS^{in}"],["KEYS_4","GETKEYS^{out}"]],
		"GB^0_{yao,d}": [["KEYS_d","GETKEYS^{in}"],["KEYS","GETKEYS^{out}"]],

		"KEYS_d": [],
		"KEYS": []
	    },
	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":360},"KEYS_1":{"x":530,"y":0,"width":90,"height":50},"KEYS_2":{"x":530,"y":60,"width":90,"height":50},"KEYS_3":{"x":530,"y":120,"width":90,"height":50},"KEYS_4":{"x":530,"y":180,"width":90,"height":50},"GB^0_{yao,1}":{"x":160,"y":30,"width":90,"height":50},"GB^0_{yao,2}":{"x":160,"y":90,"width":90,"height":50},"GB^0_{yao,3}":{"x":160,"y":150,"width":90,"height":50},"GB^0_{yao,d}":{"x":160,"y":270,"width":90,"height":50},"KEYS_d":{"x":530,"y":240,"width":90,"height":50},"KEYS":{"x":530,"y":300,"width":90,"height":50}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=1;exitY=0.05;entryX=0.1;entryY=0.35;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB^0_{yao,1}":"exitX=1;exitY=0.15;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{yao,2}":"exitX=0.9;exitY=0.35;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{yao,3}":"exitX=0.5;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{yao,d}":"exitX=0.9;exitY=0.75;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS":"exitX=1;exitY=0.95;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{yao,1}":{"KEYS_1":"exitX=0.75;exitY=0.35;entryX=0;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{yao,2}":{"KEYS_2":"exitX=0.85;exitY=0.3;entryX=0.05;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_3":"exitX=0.85;exitY=0.75;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{yao,3}":{"KEYS_3":"exitX=0.9;exitY=0.25;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_4":"exitX=0.6;exitY=0.55;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{yao,d}":{"KEYS_d":"exitX=0.75;exitY=0.35;entryX=0.05;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS":"exitX=0.6;exitY=0.55;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"GB^0_{yao,1}":[],"GB^0_{yao,2}":[],"GB^0_{yao,3}":[],"GB^0_{yao,d}":[]}}
	},

	"SEC^1(SIM_{yao})-unrolled":
	{
	    "oracles": [["BITS_1", "SETBIT"], ["AKEYS_1", "GETA^{out}"], ["GB^1_{yao,1}", "GBL_1"], ["GB^1_{yao,2}", "GBL_2"], ["GB^1_{yao,d}", "GBL_d"], ["KEYS", "GETKEYS^{in}"]],
	    "graph":
	    {
		"GB^1_{yao,1}": [["AKEYS_1", "GETA^{in}"], ["AKEYS_1", "GETINA^{in}"], ["EV_1", "EVAL_1"], ["AKEYS_2", "GETA^{out}"]],
		"GB^1_{yao,2}": [["AKEYS_2", "GETA^{in}"], ["AKEYS_2", "GETINA^{in}"], ["EV_2", "EVAL_2"], ["AKEYS_3", "GETA^{out}"]],
		"GB^1_{yao,d}": [["AKEYS_d", "GETA^{in}"], ["AKEYS_d", "GETINA^{in}"], ["EV_d", "EVAL_d"], ["KEYS", "GETA^{out}"]],


		"EV_1": [["BITS_1", "GETBIT"], ["BITS_2", "SETBIT"]],
		"EV_2": [["BITS_2", "GETBIT"], ["BITS_3", "SETBIT"]],
		"EV_d": [["BITS_d", "GETBIT"], ["KEYS", "SETBIT"]],

		"AKEYS_1": [["BITS_1", "CHECK"]],
		"AKEYS_2": [["BITS_2", "CHECK"]],
		"AKEYS_3": [["BITS_3", "CHECK"]],
		"AKEYS_d": [["BITS_d", "CHECK"]],

		"BITS_1": [],
		"BITS_2": [],
		"BITS_3": [],
		"BITS_d": [],

		"KEYS": []
	    },

	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":90,"height":430},"GB^1_{yao,1}":{"x":160,"y":70,"width":90,"height":50},"GB^1_{yao,2}":{"x":160,"y":170,"width":90,"height":50},"GB^1_{yao,d}":{"x":160,"y":350,"width":90,"height":50},"EV_1":{"x":440,"y":80,"width":90,"height":40},"EV_2":{"x":440,"y":180,"width":90,"height":40},"EV_d":{"x":440,"y":360,"width":90,"height":40},"AKEYS_1":{"x":310,"y":20,"width":90,"height":50},"AKEYS_2":{"x":310,"y":120,"width":90,"height":50},"AKEYS_3":{"x":310,"y":220,"width":90,"height":50},"AKEYS_d":{"x":310,"y":310,"width":90,"height":50},"BITS_1":{"x":710,"y":10,"width":90,"height":60},"BITS_2":{"x":710,"y":110,"width":90,"height":60},"BITS_3":{"x":710,"y":210,"width":90,"height":60},"BITS_d":{"x":710,"y":300,"width":90,"height":60},"KEYS":{"x":710,"y":380,"width":90,"height":60}},"edges":{"@oracles_interface":{"AKEYS_1":"exitX=0.999;exitY=0.111;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{yao,1}":"exitX=0.999;exitY=0.222;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{yao,2}":"entryX=0;entryY=0.5;entryPerimeter=1;exitX=0.888;exitY=0.444;exitDx=0;exitDy=0;","GB^1_{yao,d}":"exitX=0.999;exitY=0.888;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS":"exitX=0.555;exitY=0.555;entryX=0.111;entryY=0.777;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","BITS_1":"entryX=0.111;entryY=0.333;entryDx=0;entryDy=0;exitX=0.999;exitY=0.025;exitDx=0;"},"GB^1_{yao,1}":{"AKEYS_1":"exitX=0.888;exitY=0.333;entryX=0.111;entryY=0.666;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","EV_1":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","AKEYS_2":"exitX=0.888;exitY=0.666;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"GB^1_{yao,2}":{"AKEYS_2":"exitX=0.999;exitY=0.222;entryX=0.111;entryY=0.666;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","EV_2":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","AKEYS_3":"exitX=0.888;exitY=0.666;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"GB^1_{yao,d}":{"AKEYS_d":"exitX=0.999;exitY=0.222;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_d":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"entryX=0;entryY=0.666;entryDx=0;entryDy=0;exitX=0.888;exitY=0.777;exitDx=0.;exitDy=0;"},"EV_1":{"BITS_1":"exitX=0.777;exitY=0.333;entryX=0.222;entryY=0.666;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","BITS_2":"exitX=0.999;exitY=0.777;entryX=0.111;entryY=0.333;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"EV_2":{"BITS_2":"exitX=0.888;exitY=0.333;entryX=0.111;entryY=0.666;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","BITS_3":"exitX=0.777;exitY=0.666;entryX=0;entryY=0.333;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"EV_d":{"BITS_d":"exitX=0.888;exitY=0.333;entryX=0.111;entryY=0.666;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS":"exitX=0.999;exitY=0.777;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"AKEYS_1":{"BITS_1":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.555;entryDx=0;entryDy=0;"},"AKEYS_2":{"BITS_2":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"AKEYS_3":{"BITS_3":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"AKEYS_d":{"BITS_d":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"}}
	    }
	},

	"\\mathcal{R}^i_{circ}{\\rightarrow}LSEC^1(GB_{yao,i})":
	{
	    "oracles": [["KEYS_1", "GETA^{out}"], ["KEYS_1", "SETBIT"], ["GB^1_{yao,1}", "GBL_1"], ["GB^1_{yao,i-1}", "GBL_{i-1}"], ["GB^1_{yao,i}", "GBL_i"], ["GB^0_{yao,i+1}", "GBL_{i+1}"], ["GB^0_{yao,i+2}", "GBL_{i+2}"], ["GB^0_{yao,d}", "GBL_d"], ["KEYS", "GETKEYS^{in}"]],
	    "graph":
	    {
		"KEYS_1": [],
		"KEYS": [],
		"KEYS_2": [],
		"KEYS_{i-1}": [],
		"KEYS_i": [],
		"KEYS_{i+1}": [],
		"KEYS_{i+2}": [],
		"KEYS_{i+3}": [],
		"KEYS_d": [],

		"GB^1_{yao,1}": [["KEYS_1", "GETA^{in}"], ["KEYS_1", "GETINA^{in}"], ["EV_1", "EVAL"], ["KEYS_2", "GETA_{out}"]],
		"EV_1": [["KEYS_1", "GETBIT"], ["KEYS_2", "SETBIT"]],

		"GB^1_{yao,i-1}": [["KEYS_{i-1}", "GETA^{in}"], ["KEYS_{i-1}", "GETINA^{in}"], ["EV_{i-1}", "EVAL"], ["KEYS_i", "GETA_{out}"]],
		"EV_{i-1}": [["KEYS_{i-1}", "GETBIT"], ["KEYS_i", "SETBIT"]],

		"GB^1_{yao,i}": [["KEYS_i", "GETA^{in}"], ["KEYS_i", "GETINA^{in}"], ["EV_i", "EVAL"], ["KEYS_{i+1}", "GETA_{out}"]],
		"EV_i": [["KEYS_i", "GETBIT"], ["KEYS_{i+1}", "SETBIT"]],

		"GB^0_{yao,i+1}": [["KEYS_{i+1}", "GETKEYS^{in}"], ["KEYS_{i+2}", "GETKEYS^{out}"]],
		"GB^0_{yao,i+2}": [["KEYS_{i+2}", "GETKEYS^{in}"], ["KEYS_{i+3}", "GETKEYS^{out}"]],
		"GB^0_{yao,d}": [["KEYS_d", "GETKEYS^{in}"], ["KEYS", "GETKEYS^{out}"]]

	    },
	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":660},"KEYS_1":{"x":550,"y":10,"width":90,"height":40},"KEYS":{"x":550,"y":610,"width":90,"height":40},"KEYS_2":{"x":550,"y":100,"width":90,"height":40},"KEYS_{i-1}":{"x":550,"y":160,"width":90,"height":40},"KEYS_i":{"x":550,"y":260,"width":90,"height":40},"KEYS_{i+1}":{"x":550,"y":340,"width":90,"height":40},"KEYS_{i+2}":{"x":550,"y":430,"width":90,"height":40},"KEYS_{i+3}":{"x":550,"y":510,"width":90,"height":40},"KEYS_d":{"x":550,"y":560,"width":90,"height":40},"GB^1_{yao,1}":{"x":160,"y":50,"width":90,"height":60},"EV_1":{"x":410,"y":60,"width":90,"height":40},"GB^1_{yao,i-1}":{"x":160,"y":200,"width":90,"height":60},"EV_{i-1}":{"x":410,"y":210,"width":90,"height":40},"GB^1_{yao,i}":{"x":160,"y":290,"width":90,"height":60},"EV_i":{"x":410,"y":300,"width":90,"height":40},"GB^0_{yao,i+1}":{"x":160,"y":380,"width":90,"height":60},"GB^0_{yao,i+2}":{"x":160,"y":460,"width":90,"height":60},"GB^0_{yao,d}":{"x":160,"y":570,"width":90,"height":60}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=1;exitY=0.035;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB^1_{yao,1}":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{yao,i-1}":"exitX=0.65;exitY=0.45;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{yao,i}":"entryX=0;entryY=0.5;entryPerimeter=1;exitX=1;exitY=0.45;exitDx=0;exitDy=0;","GB^0_{yao,i+1}":"exitX=0.7;exitY=0.55;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{yao,i+2}":"exitX=0.95;exitY=0.7;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{yao,d}":"exitX=0.8;exitY=0.75;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS":"exitX=1;exitY=0.98;entryX=0.1;entryY=0.8;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^1_{yao,1}":{"KEYS_1":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_1":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_2":"exitX=0.7;exitY=0.65;entryX=0;entryY=0.65;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"EV_1":{"KEYS_1":"exitX=0.75;exitY=0.4;entryX=0;entryY=0.85;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_2":"exitX=0.65;exitY=0.6;exitDx=0;exitDy=0;entryX=0;entryY=0.25;entryDx=0;entryDy=0;"},"GB^1_{yao,i-1}":{"KEYS_{i-1}":"exitX=0.85;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_{i-1}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_i":"exitX=0.65;exitY=0.6;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"EV_{i-1}":{"KEYS_{i-1}":"exitX=0.65;exitY=0.45;entryX=0;entryY=0.85;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_i":"exitX=0.65;exitY=0.6;entryX=0;entryY=0.2;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"GB^1_{yao,i}":{"KEYS_i":"exitX=0.65;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_i":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_{i+1}":"exitX=0.7;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"EV_i":{"KEYS_i":"exitX=0.75;exitY=0.4;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_{i+1}":"exitX=0.85;exitY=0.65;entryX=0.05;entryY=0.2;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"GB^0_{yao,i+1}":{"KEYS_{i+1}":"exitX=0.75;exitY=0.4;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_{i+2}":"exitX=0.85;exitY=0.6;entryX=0;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"GB^0_{yao,i+2}":{"KEYS_{i+2}":"exitX=0.7;exitY=0.45;entryX=0.05;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_{i+3}":"exitX=0.9;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"GB^0_{yao,d}":{"KEYS_d":"exitX=0.85;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS":"exitX=0.9;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"}}
    }
	},


	"LSEC^1_{1..d}(GB^1_{yao})":
	{
	    "oracles": [["KEYS_1", "SETBIT"], ["KEYS_1", "GETA^{out}"],
			   ["GB^1_{yao,1}", "GBL_1"],
			   ["GB^1_{yao,2}", "GBL_2"],
			   ["GB^1_{yao,d}", "GBL_d"],
			["KEYS", "GETKEYS^{in}"]],

	    "graph":
	    {
		"GB^1_{yao,1}": [["KEYS_1", "GETA^{in}"], ["KEYS_1", "GETINA^{in}"], ["EV_1", "EVAL_1"], ["KEYS_2", "GETA^{out}"]],
		"GB^1_{yao,2}": [["KEYS_2", "GETA^{in}"], ["KEYS_2", "GETINA^{in}"], ["EV_2", "EVAL_2"], ["KEYS_3", "GETA^{out}"]],
		"GB^1_{yao,d}": [["KEYS_d", "GETA^{in}"], ["KEYS_d", "GETINA^{in}"], ["EV_d", "EVAL_d"], ["KEYS", "GETA^{out}"]],

		"EV_1": [["KEYS_1", "GETBIT"], ["KEYS_2", "SETBIT"]],
		"EV_2": [["KEYS_2", "GETBIT"], ["KEYS_3", "SETBIT"]],
		"EV_d": [["KEYS_d", "GETBIT"], ["KEYS", "SETBIT"]],

		"KEYS_1": [],
		"KEYS_2": [],
		"KEYS_3": [],
		"KEYS_d": [],

		"KEYS": []
	    },

	    "layout": {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":30,"height":420},"GB^1_{yao,1}":{"x":100,"y":50,"width":90,"height":70},"GB^1_{yao,2}":{"x":100,"y":150,"width":90,"height":70},"GB^1_{yao,d}":{"x":100,"y":300,"width":90,"height":70},"EV_1":{"x":350,"y":60,"width":90,"height":40},"EV_2":{"x":350,"y":160,"width":90,"height":40},"EV_d":{"x":340,"y":320,"width":90,"height":40},"KEYS_1":{"x":490,"y":10,"width":90,"height":40},"KEYS_2":{"x":490,"y":110,"width":90,"height":40},"KEYS_3":{"x":490,"y":210,"width":90,"height":40},"KEYS_d":{"x":490,"y":280,"width":90,"height":40},"KEYS":{"x":490,"y":360,"width":90,"height":40}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=0.999;exitY=0.05;entryX=0.111;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB^1_{yao,1}":"exitX=0.999;exitY=0.222;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{yao,2}":"exitX=0.999;exitY=0.444;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{yao,d}":"exitX=0.777;exitY=0.666;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS":"exitX=0.999;exitY=0.935;entryX=0;entryY=0.777;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^1_{yao,1}":{"KEYS_1":"exitX=0.888;exitY=0.222;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_1":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_2":"exitX=0.777;exitY=0.666;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"GB^1_{yao,2}":{"KEYS_2":"exitX=0.999;exitY=0.111;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_2":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_3":"exitX=0.888;exitY=0.777;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"GB^1_{yao,d}":{"KEYS_d":"exitX=0.888;exitY=0.222;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_d":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.888;exitY=0.777;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"EV_1":{"KEYS_1":"exitX=0.888;exitY=0.333;entryX=0.222;entryY=0.666;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_2":"exitX=0.888;exitY=0.666;entryX=0;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"EV_2":{"KEYS_2":"exitX=0.999;exitY=0.222;entryX=0.222;entryY=0.666;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_3":"exitX=0.888;exitY=0.666;entryX=0.111;entryY=0.333;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"EV_d":{"KEYS_d":"exitX=0.999;exitY=0.222;entryX=0.222;entryY=0.666;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS":"exitX=0.999;exitY=0.777;entryX=0.222;entryY=0.333;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}}
	    }
	},


	"LSEC^0_i(GB^0_{yao,i})-with-GB^0_{yao,i}":
	{
	    "oracles": [["KEYS_1", "SETBIT"],["KEYS_1", "GETA^{out}"],["MODGB_i", "GBL_i"],["KEYS", "GETKEYS^{in}"]],

	    "graph":
	    {
		"MODGB_i": [["MODDENC","DENC"]],
		"MODDENC": [["ENC^0_{1..n}", "ENC"], ["KEYS", "GETKEYS^{out}"]],
		"ENC^0_{1..n}": [["KEYS_1", "GETKEYS^{in}"]],
		"KEYS_1": [],
		"KEYS": []
	    },

	    "layout": {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":180},"MODGB_i":{"x":70,"y":80,"width":90,"height":40},"MODDENC":{"x":230,"y":80,"width":90,"height":40},"ENC^0_{1..n}":{"x":390,"y":50,"width":90,"height":40},"KEYS_1":{"x":560,"y":10,"width":90,"height":40},"KEYS":{"x":560,"y":130,"width":90,"height":40}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=0.777;exitY=0.333;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","MODGB_i":"entryX=0;entryY=0.5;entryPerimeter=1;exitX=0.999;exitY=0.555;exitDx=0;exitDy=0;","KEYS":"exitX=0.888;exitY=0.777;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"MODGB_i":{"MODDENC":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"MODDENC":{"ENC^0_{1..n}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.888;exitY=0.666;entryX=0.222;entryY=0.333;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"ENC^0_{1..n}":{"KEYS_1":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.111;entryY=0.666;entryDx=0;entryDy=0;"}}
	    }
	},

	"HYB_i":
	{
	    "oracles": [["KEYS_1", "SETBIT"],["KEYS_1", "GETA^{out}"],["MODGB_i", "GBL_i"],["KEYS", "GETKEYS^{in}"]],

	    "graph":
	    {
		"MODGB_i": [["MODDENC","DENC"]],
		"MODDENC": [["ENC^1_{1..n}", "ENC"], ["KEYS", "GETKEYS^{out}"]],
		"ENC^1_{1..n}": [["KEYS_1", "GETKEYS^{in}"], ["KEYS_1", "GETBIT"]],
		"KEYS_1": [],
		"KEYS": []
	    },

	    "layout": {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":180},"MODGB_i":{"x":70,"y":80,"width":90,"height":40},"MODDENC":{"x":230,"y":80,"width":90,"height":40},"ENC^1_{1..n}":{"x":390,"y":50,"width":90,"height":40},"KEYS_1":{"x":560,"y":10,"width":90,"height":40},"KEYS":{"x":560,"y":130,"width":90,"height":40}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=0.777;exitY=0.333;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","MODGB_i":"entryX=0;entryY=0.5;entryPerimeter=1;exitX=0.999;exitY=0.555;exitDx=0;exitDy=0;","KEYS":"exitX=0.888;exitY=0.777;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"MODGB_i":{"MODDENC":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"MODDENC":{"ENC^1_{1..n}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.888;exitY=0.666;entryX=0.222;entryY=0.333;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"ENC^1_{1..n}":{"KEYS_1":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.111;entryY=0.666;entryDx=0;entryDy=0;"}}
	    }
	},

	"HYB_i-GDENC":
	{
	    "oracles": [["GDENC", "SETBIT"],["GDENC", "GETA^{out}"],["MODGB_i", "GBL_i"],["GDENC", "GETKEYS^{in}"]],

	    "graph":
	    {
		"MODGB_i": [["GDENC","DENC"]],
		"GDENC": []
	    },

	    "layout": {
		"nodes":{"@oracles_interface":{"x":-10,"y":0,"width":20,"height":140},"MODGB_i":{"x":70,"y":60,"width":90,"height":40},"GDENC":{"x":230,"y":0,"width":420,"height":150}},"edges":{"@oracles_interface":{"GDENC":"exitX=0.888;exitY=0.222;entryX=0.111;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","MODGB_i":"exitX=0.777;exitY=0.555;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"MODGB_i":{"GDENC":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.555;entryDx=0;entryDy=0;"}}
	    }
	},

	"LSEC^1_i(SIM_{yao,i})":
	{
	    "oracles": [["KEYS_1", "SETBIT"],["KEYS_1", "GETA^{out}"],["MODGB_i", "GBL_i"],["KEYS", "GETKEYS^{in}"]],

	    "graph":
	    {
		"MODGB_i": [["SIM_{denc}","DENC"]],
		"SIM_{denc}": [["EV", "EVAL"], ["KEYS", "GETA^{out}"], ["KEYS_1", "GETA^{in}"], ["KEYS_1", "GETINA^{in}"]],
		"EV": [["KEYS_1", "GETBIT"], ["KEYS", "SETBIT"]],
		"KEYS_1": [],
		"KEYS": []
	    },

	    "layout": {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":200},"MODGB_i":{"x":70,"y":80,"width":90,"height":40},"SIM_{denc}":{"x":230,"y":60,"width":90,"height":80},"EV":{"x":380,"y":80,"width":90,"height":40},"KEYS_1":{"x":560,"y":10,"width":90,"height":40},"KEYS":{"x":560,"y":150,"width":90,"height":40}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=0.999;exitY=0.111;entryX=0;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","MODGB_i":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.999;exitY=0.888;exitDx=0;exitDy=0;entryX=0.111;entryY=0.666;entryDx=0;entryDy=0;"},"MODGB_i":{"SIM_{denc}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"SIM_{denc}":{"EV":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.888;exitY=0.777;exitDx=0;exitDy=0;entryX=0.222;entryY=0.444;entryDx=0;entryDy=0;","KEYS_1":"exitX=0.999;exitY=0.111;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"EV":{"KEYS_1":"exitX=0.666;exitY=0.444;entryX=0.222;entryY=0.666;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS":"exitX=0.666;exitY=0.555;entryX=0.111;entryY=0.222;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}}
	    }
	},

	"LSEC^1_i(GB^1_{yao,i})-with-GB^1_{yao,i}":
	{
	    "oracles": [["KEYS_1", "SETBIT"],["KEYS_1", "GETA^{out}"],["MODGB_i", "GBL_i"],["KEYS", "GETKEYS^{in}"]],

	    "graph":
	    {
		"MODGB_i": [["SIM_{denc}","DENC"]],
		"SIM_{denc}": [["EV", "EVAL"], ["KEYS", "GETA^{out}"], ["KEYS_1", "GETA^{in}"], ["KEYS_1", "GETINA^{in}"]],
		"EV": [["KEYS_1", "GETBIT"], ["KEYS", "SETBIT"]],
		"KEYS_1": [],
		"KEYS": []
	    },

	    "layout": {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":200},"MODGB_i":{"x":70,"y":80,"width":90,"height":40},"SIM_{denc}":{"x":230,"y":60,"width":90,"height":80},"EV":{"x":380,"y":80,"width":90,"height":40},"KEYS_1":{"x":560,"y":10,"width":90,"height":40},"KEYS":{"x":560,"y":150,"width":90,"height":40}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=0.999;exitY=0.111;entryX=0;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","MODGB_i":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.999;exitY=0.888;exitDx=0;exitDy=0;entryX=0.111;entryY=0.666;entryDx=0;entryDy=0;"},"MODGB_i":{"SIM_{denc}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"SIM_{denc}":{"EV":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.888;exitY=0.777;exitDx=0;exitDy=0;entryX=0.222;entryY=0.444;entryDx=0;entryDy=0;","KEYS_1":"exitX=0.999;exitY=0.111;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"EV":{"KEYS_1":"exitX=0.666;exitY=0.444;entryX=0.222;entryY=0.666;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS":"exitX=0.666;exitY=0.555;entryX=0.111;entryY=0.222;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}}
	    }
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
		    "text": "Let \\(\\mathcal{A}\\) be a PPT adversary, let \\(d\\) be a polynomial upper bound on the depth of the circuit which \\(\\mathcal{A}\\) chooses, let \\(n\\) denote the width of the circuit and let \\(se\\) denote the symmetric encryption scheme used within \\(\\mathsf{GB_{yao}}\\). Then, there exists a PPT reduction \\(\\mathcal{R}\\) such that $$\\mathsf{Adv}(\\mathcal{A};\\mathsf{SEC^0(GB_{yao})}, \\mathsf{SEC^1(SIM_{yao})}) \\leq  d \\cdot n \\cdot \\mathsf{Adv}(\\mathcal{A} \\rightarrow \\mathcal{R}; \\mathsf{IND\\text{-}CPA^0}(se),\\mathsf{IND\\text{-}CPA^1}(se))$$"
		},
		{
		    "graphs": [["SEC^0(GB_{yao})"], ["SEC^1(SIM_{yao})"]]
		},
		{
		    "text": "In particular, \\(\\mathcal{R}\\) is defined as sampling a uniformly random \\(i ←$ \\{1, .., d\\}\\) and running \\(\\mathcal{R}^i := \\mathcal{R}^i_{circ} \\rightarrow \\mathcal{R}^i_{layer} \\rightarrow \\mathcal{R}_{se}\\) where reduction, \\(\\mathcal{R}^i_{layer}\\) is defined in Lemma 2, reduction \\(\\mathcal{R}^i_{circ}\\) is in Lemma 1 and reduction \\(\\mathcal{R}_{se}\\) is defined in Lemma 3."
		}
	    ]
	},

	"Lemma1" :
	{
	    "parent": "Theorem",
	    "contents": [
		{
		    "text": "Lemma 1 (circuit security)."
		},

		{
		    "text": "Let \\(d\\) be a polynomial upper bound on the depth of the circuit which \\(\\mathcal{A}\\) chooses. Then for each \\(1 \\leq i \\leq d\\) there exists PPT reductions, \\(\\mathcal{R}^i_{circ}\\) such that $$\\mathsf{Adv}(\\mathcal{A};\\mathsf{SEC^0(GB_{yao})}, \\mathsf{SEC^1(SIM_{yao})}) \\leq  \\sum_{i=1}^{d} \\mathsf{Adv}(\\mathcal{A} \\rightarrow \\mathcal{R}^i_{circ}; \\mathsf{LSEC^0(GB_{yao,i}}), \\mathsf{LSEC^1(SIM_{yao,i}})$$"
		},
		// {
		//     "graphs": [["Gyao-sec^0-unrolled"]]
		// },
	    ]
	},

	"Lemma2" :
	{
	    "parent": "Theorem",
	    "contents": [
		{
		    "text": "Lemma 2 (layer security)."
		},
		{
		    "text": "Let \\(\\mathcal{R}^i_{layer}\\), s.t. $$\\mathsf{Adv}(\\mathcal{A}; \\mathsf{LSEC^0(GB_{yao,i}}), \\mathsf{LSEC^1(SIM_{yao,i}})) \\leq \\mathsf{Adv}(\\mathcal{A} \\rightarrow \\mathcal{R}^i_{layer}; \\mathsf{IND\\text{-}CPA^0_{1..n}}(se),\\mathsf{IND\\text{-}CPA^1_{1..n}}(se))$$"
		}		// {
		//     "graphs": [["Gyao-sec^0"], ["Gyao-sec^1"]]
		// },

	    ]
	},

	"Lemma3" :
	{
	    "parent": "Theorem",
	    "contents": [
		{
		    "text": "Lemma 3 (Self composition (BDFKK))."
		},
		{
		    "text": "There exists a PPT reduction \\(\\mathcal{R}_{se}\\), s.t. $$\\mathsf{Adv}(\\mathcal{A}; \\mathsf{IND\\text{-}CPA^0_{1..n}}(se),\\mathsf{IND\\text{-}CPA^1_{1..n}}(se)) \\leq n \\cdot \\mathsf{Adv}(\\mathcal{A} \\rightarrow \\mathcal{R}_{se}; \\mathsf{IND\\text{-}CPA^0}(se),\\mathsf{IND\\text{-}CPA^1}(se))$$"
		}

	    ],

	},

	"Claim1" :
	{
	    "parent": "Lemma1",
	    "contents": [
		{
		    "text": "(Reduction of circuit garbling to layer garbling)."
		},

		{
		    "graphs": [["SEC^0(GB_{yao})"], ["SEC^0(GB_{yao})-unrolled"]]
		},
	    ],
	},

	"Eq5" :
	{
	    "parent": "Claim1",
	    "contents": [
		{
		    "text": "\\( \\mathsf{SEC^0}(\\mathsf{GB_{yao}}) \\stackrel{\\text{code}}{\\equiv} \\mathcal{R}^1_{circ} \\rightarrow \\mathsf{LSEC^0}(\\mathsf{GB_{yao,1}}) \\)"
		},

		{
		    "graphs": [["SEC^0(GB_{yao})-unrolled"]]
		},
	    ],

	    "type":
	    {
		"codeq":
		{
		    "graph": "SEC^0(GB_{yao})-unrolled",
		    // "packages": ["GB^0_{yao,1}", "KEYS_1", "KEYS_2"]
		    "packages": ["GB^0_{yao,2}", "GB^0_{yao,d}", "KEYS"]
		}
	    }
	},

	"Eq6" :
	{
	    "parent": "Claim1",
	    "contents": [
		{
		    "text": "Graphs in Eq6-1 and Eq6-2 are code equivalent. \\(\\mathcal{R}^i_{circ} \\rightarrow \\mathsf{LSEC^1}(\\mathsf{GB_{yao,i}}) \\stackrel{\\text{code}}{\\equiv} \\mathcal{R}^{i+1}kx`xx_{circ}\\rightarrow \\mathsf{LSEC^1}(\\mathsf{GB_{yao,i+1}})\\)"
		}
	    ],
	    "type":
	    {

	    }
	},

	"Eq6-1" :
	{
	    "parent": "Eq6",
	    "contents": [
		{
		    "graphs": [["\\mathcal{R}^i_{circ}{\\rightarrow}LSEC^1(GB_{yao,i})"]]
		},
	    ],
	    "type":
	    {
		"reduction":
		{
		    "graph": "\\mathcal{R}^i_{circ}{\\rightarrow}LSEC^1(GB_{yao,i})",
		    "cut": ["GB^1_{yao,i}", "KEYS_i", "KEYS_{i+1}", "EV_i"]
		}
	    }
	},

	"Eq6-2" :
	{
	    "parent": "Eq6",
	    "contents": [
		{
		    "graphs": [["\\mathcal{R}^i_{circ}{\\rightarrow}LSEC^1(GB_{yao,i})"]]
		},
	    ],
	    "type":
	    {
		"reduction":
		{
		    "graph": "\\mathcal{R}^i_{circ}{\\rightarrow}LSEC^1(GB_{yao,i})",
		    "cut": ["GB^0_{yao,i+1}", "KEYS_{i+1}", "KEYS_{i+2}"]
		}
	    }
	},


	"Eq7" :
	{
	    "parent": "Claim1",
	    "contents": [
		{
		    "text": "(Reduction of circuit garbling to layer garbling)."
		},

		{
		    "graphs": [["LSEC^1_{1..d}(GB^1_{yao})", "LSEC^1_{1..d}(GB^1_{yao})"]]
		},
	    ],
	    "type":
	    {
		"reduction":
		{
		    "graph": "LSEC^1_{1..d}(GB^1_{yao})",
		    "cut": ["GB^1_{yao,d}", "EV_d", "KEYS_d", "KEYS"]
		}
	    }
	},


	"Claim3" :
	{
	    "parent": "Lemma2",
	    "contents": [
		{
		    "text": "Layer security Real code equivalence (graphs in Real-Layer-reduction) and Real-Layer-GDENC)"
		},
	    ],
	},

	"RL" :
	{
	    "parent": "Claim3",
	    "contents": [
		{
		    "text": "Real layer security with reduction \\(\\mathcal{R}_{layer,i}\\) highlighted with dotted line."
		},
		{
		    "graphs": [["HYB_i"]]
		},
	    ],
	    	    "type":
	    {
		"codeq": {
		    "oracles": {},
		    "graph": "HYB_i",
		    "packages": ["MODGB_i", "MODDENC"]
		}
	    }
	},

	"RL-GDENC" :
	{
	    "parent": "Claim3",
	    "contents": [
		{
		    "text": "\\(\\mathsf{GDENC}\\) is highlighted with a dotted line."
		},
		{
		    "graphs": [["HYB_i"]]
		},
	    ],
	    	    "type":
	    {
		"codeq": {
		    "oracles": {},
		    "graph": "HYB_i",
		    "packages": ["MODDENC", "KEYS_1", "KEYS"]
		}
	    }
	},



	"Claim4" :
	{
	    "parent": "Lemma2",
	    "contents": [
		{
		    "text": "Ideal Layer security code equivalence."
		},
		// {
		//     "graphs": [["LSEC^1_i(SIM_{yao,i})"]]
		// }
	    ]
	},


	"IL-GDENC" :
	{
	    "parent": "Claim4",
	    "contents": [
		{
		    "text": "\\(\\mathsf{GDENC}\\) is highlighted with a dotted line."
		},
		{
		    "graphs": [["LSEC^1_i(SIM_{yao,i})"]]
		},
	    ],
	    "type":
	    {
		"codeq": {
		    "oracles": {},
		    "graph": "LSEC^1_i(SIM_{yao,i})",
		    "packages": ["SIM_{denc}", "KEYS_1", "KEYS"]
		}
	    }
	},


	"IL" :
	{
	    "parent": "Claim4",
	    "contents": [
		{
		    "text": "Ideal layer security with reduction \\(\\mathcal{R}_{layer,i}\\) highlighted with dotted line."
		},
		{
		    "graphs": [["LSEC^1_i(SIM_{yao,i})"]]
		},
	    ],

	    "type":
	    {
		"codeq": {
		    "oracles": {
			"................GDENC.DENC1" :
			{
			    "code": "\\tilde{g}_j @gets @bot; Z_j^{out} @gets \\mathsf{GETKEYS}^{out}(j); ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;@for (b_{\\ell},b_r) \\in \\{0,1\\}^2 @do;@> b_j @gets op(b_{\\ell}, b_r);@> k^0_j @gets Z^{out}_j(b_j);@> c^0_{in} @gets ENC(b^{\\ell},k^0_j,0^\\lambda); ; ; ; ;@> c^1_{in} @gets ENC(b^{\\ell},0^\\lambda,0^\\lambda);@> c @sample ENC(b^r, c^0_{in}, c^1_{in}); ; ; ; ;@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j",
			    "params": ["j", "\\ell", "r", "op"]
			},

			"................GDENC.DENC2" :
			{
			    "code": "\\tilde{g}_j @gets @bot;z^{in}_{\\ell} @gets \\mathsf{GETBIT}^{in}(\\ell);z^{in}_r @gets \\mathsf{GETBIT}^{in}(r); ; ;Z^{out}_j @gets \\mathsf{GETKEYS}^{out}(j); ; ; ; ;Z^{in}_{\\ell} @gets \\mathsf{GETKEYS}^{out}(\\ell); ; ; ; ; ; ; ;Z^{in}_r @gets \\mathsf{GETKEYS}^{in}(r); ; ; ; ; ; ; ;@for (b_{\\ell}, b_r) \\in \\{0,1\\}^2 @do;@> b_j @gets op(b_{\\ell}, b_r);@> k^{out}_j @gets Z^{out}_j(b_j);@> k^{in}_{\\ell} @gets Z^{in}_{\\ell}(b_{\\ell});@> @if z^{in}_{\\ell} = b_{\\ell} @then; @> @> c^0_{in} @sample enc_{k^{in}_{\\ell}}(k^{out}_j);@> @else;@> @> c^0_{in} @sample enc_{k^{in}_{\\ell}}(0^{\\lambda});@> c^1_{in} @sample enc_{k^{in}_{\\ell}}(0^{\\lambda});@> k^{in}_r @gets Z^{in}_r(b_r);@> @if z^{in}_r = b_r @then; @> @> c^0_{in} @sample enc_{k^{in}_r}(c^0_{in}); @> @else; @> @> c^0_{in} @sample enc_{k^{in}_r}(c^1_{in});@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j",
			    "params": ["j", "\\ell", "r", "op"]
			},

			"................GDENC.DENC3" :
			{
			    "code": "\\tilde{g}_j @gets @bot;@assert z^{in}_{\\ell} \\neq @bot;@assert z^{in}_r \\neq @bot; z^{out}_j @gets op(z^{in}_{\\ell}, z^{in}_r); ;\\mathsf{bflag}^{out}_j @gets 1;@if Z^{out}_j = @bot;@> Z^{out}_j(0) @sample \\{0,1\\}^{\\lambda};@> Z^{out}_j(1) @sample \\{0,1\\}^{\\lambda}; ;@assert z^{in}_r \\neq @bot;@assert \\mathsf{aflag}^{in}_r = 1 \\vee \\mathsf{bflag}^{in}_r = 1; @assert Z^{in}_r \\neq @bot; ; ; ; ; ;@assert z'_{\\ell} \\neq @bot;@assert \\mathsf{aflag}^{in}_{\\ell} = 1 \\vee \\mathsf{bflag}^{in}_{\\ell} = 1;@assert Z^{in}_{\\ell} \\neq @bot; ; ; ; ; ;@for (b_{\\ell}, b_r) \\in \\{0,1\\}^2 @do;@> k^{in}_{\\ell} @gets Z^{in}_{\\ell}(b_{\\ell});@> k^{in}_r @gets Z^{in}_r(b_r);@> @if b_{\\ell} = z^{in}_{\\ell} \\wedge b_r = z^{in}_r @then;@> @> b_j @gets op(b_{\\ell}, b_r);@> @> k^{out}_j @gets Z^{out}_j(b_j);@> @else k^{out}_j @gets 0^{\\lambda};@> c_{in} @sample enc_{k^{in}_{\\ell}}(k^{in}_{\\ell});@> c @sample enc_{k^{in}_r}(k^{in}_r);@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j;",
			    "params": ["j", "\\ell", "r", "op"]
			},

			"................GDENC.DENC4" :
			{
			    "code": "\\tilde{g}_j @gets @bot;@assert z^{in}_{\\ell} \\neq @bot;@assert z^{in}_r \\neq @bot; z^{out}_j @gets op(z^{in}_{\\ell}, z^{in}_r); ;\\mathsf{aflag}^{out}_j @gets 1;@if Z^{out}_j = @bot;@> Z^{out}_j(0) @sample \\{0,1\\}^{\\lambda};@> Z^{out}_j(1) @sample \\{0,1\\}^{\\lambda}; ;@assert z^{in}_r \\neq @bot;@assert \\mathsf{aflag}^{in}_r = 1; @assert Z^{in}_r \\neq @bot; ; ; ; ; ;@assert z'_{\\ell} \\neq @bot;@assert \\mathsf{aflag}^{in}_{\\ell} = 1;@assert Z^{in}_{\\ell} \\neq @bot; ; ; ; ; ;@for (b_{\\ell} \\oplus z'_{\\ell},b_r \\oplus z'_r) \\in \\{0,1\\}^2 @do;@> k^{in}_{\\ell} @gets Z^{in}_{\\ell}(b_{\\ell});@> k^{in}_r @gets Z^{in}_r(b_r);@> @if b_{\\ell} \\oplus z^{in}_{\\ell} = b_r \\oplus z^{in}_r = 0 @then;@> @> b_j @gets op(b_{\\ell}, b_r);@> @> k^{out}_j @gets Z^{out}_j(b_j);@> @else k^{out}_j @gets 0^{\\lambda};@> c_{in} @sample enc_{k^{in}_{\\ell}}(k^{in}_{\\ell});@> c @sample enc_{k^{in}_r}(k^{in}_r);@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j;",
			    "params": ["j", "\\ell", "r", "op"]
			},

			"...........GDENC_{sim}.DENC1" :
			{
			    "code": "\\tilde{g}_j @gets @bot;@assert z^{in}_{\\ell} \\neq @bot;@assert z^{in}_r \\neq @bot; z^{out}_j @gets op(z^{in}_{\\ell}, z^{in}_r);@assert z^{out}_j \\neq @bot;\\mathsf{aflag}^{out}_j @gets 1;@if Z^{out}_j = @bot;@> Z^{out}_j(0) @sample \\{0,1\\}^{\\lambda};@> Z^{out}_j(1) @sample \\{0,1\\}^{\\lambda};S^{out}_j(0) @gets Z^{out}_j(z^{in}_j);@assert z^{in}_r \\neq @bot;@assert \\mathsf{aflag}^{in}_r @gets 1;@assert Z^{in}_r \\neq @bot;S^{in}_r(0) @gets Z^{in}_r(z^{in}_r);@assert z^{in}_r \\neq \\bot;@assert \\mathsf{aflag}^{in}_{\\ell} = 1;@assert Z^{in}_r \\neq \\bot;S^{in}_r(1) @gets Z^{in}_r(1 \\oplus z^{in}_r);@assert z^{in}_{\\ell} \\neq \\bot;@assert \\mathsf{aflag}^{in}_{\\ell} = 1;@assert Z^{in}_{\\ell} \\neq @bot; S^{in}_{\\ell}(0) @gets Z^{in}_{\\ell}(z^{in}_{\\ell});@assert z^{in}_{\\ell} \\neq @bot;@assert \\mathsf{aflag}^{in}_{\\ell} = 1;@assert Z^{in}_{\\ell} \\neq @bot;S^{in}_{\\ell}(1) @gets Z^{in}_{\\ell}(1 \\oplus z^{in}_{\\ell});@for (d_{\\ell},d_r) \\in \\{0,1\\}^2 @do;@> k^{in}_{\\ell} @gets S^{in}_{\\ell}(d_{\\ell});@> k^{in}_r @gets S^{in}_r(d_r);@> @if d_{\\ell} = d_r = 0 @then; ;@> @> k^{out}_j @gets S^{out}_j(0);@> @else k^{out}_j @gets 0^{\\lambda};@> c_{in} @sample enc_{k^{in}_r}(k^{out}_j);@> c @sample enc_{k^{in}_{\\ell}}(c_{in});@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j;",
			    "params": ["j", "\\ell", "r", "op"]
			},

			"...........GDENC_{sim}.DENC2" :
			{
			    "code": "\\tilde{g}_j @gets @bot;\\mathsf{EVAL}_j(\\ell, r, op); ; ;S^{out}_j(0) @gets \\mathsf{GETA}^{out}(j); ; ; ; ; ;S^{in}_r(0) @gets \\mathsf{GETA}^{in}(r); ; ; ;S^{in}_r(1) @gets \\mathsf{GETINA}^{in}(r); ; ; ;S^{in}_{\\ell}(0) @gets \\mathsf{GETA}^{in}(\\ell); ; ; ;S^{in}_{\\ell}(1) @gets \\mathsf{GETA}^{in}(\\ell); ; ; ;@for (d_{\\ell},d_r) \\in \\{0,1\\}^2 @do;@> k^{in}_{\\ell} @gets S^{in}_{\\ell}(d_{\\ell});@> k^{in}_r @gets S^{in}_r(d_r);@> @if d_{\\ell} = d_r = 0 @then; ;@> @> k^{out}_j @gets S^{out}_j(0);@> @else k^{out}_j @gets 0^{\\lambda};@> c_{in} @sample enc_{k^{in}_r}(k^{out}_j);@> c @sample enc_{k^{in}_{\\ell}}(c_{in});@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j;",
			    "params": ["j", "\\ell", "r", "op"]
			}

		    },
		    "annotations":
		    [
			{
			    "cells":
			    {
				"................GDENC.DENC4": [26]
			    },

			    "comment": "Notice that the order of the enumeration of this loop does not matter."
			}
		    ],

		    "graph": "LSEC^1_i(SIM_{yao,i})",
		    "packages": ["MODGB_i", "SIM_{denc}"],
		}
	    }
	},


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

yao_driver();
