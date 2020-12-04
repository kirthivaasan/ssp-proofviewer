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
		    "code": "\\tilde{g}_j @gets @bot;Z_j^{out} @gets GETKEYS^{out}(j);@for (b_{\\ell},b_r) \\in \\{0,1\\}^2 @do;    b_j @gets op(b_{\\ell}, b_r);    k^0_j @gets Z^{out}_j(b_j);    c^0_{in} @gets ENC(b^{\\ell},k^0_j,0^\\lambda);    c^1_{in} @gets ENC(b^{\\ell},0^\\lambda,0^\\lambda);    c @sample ENC(b^r, c^0_{in}, c^1_{in});    \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j;",
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
	    "oracles": [["KEYS_0", "SETBIT"],["KEYS_0", "GETA^{out}"],["GB_{yao}", "GBL_{1..d}"],["KEYS_{d}", "GETKEYS^{in}"]],

	    "graph":
	    {
		"GB_{yao}": [["KEYS_0","GETKEYS^{in}"],["KEYS_{d}","GETKEYS^{out}"]],
		"KEYS_0": [],
		"KEYS_{d}": []
	    },

	    "layout":
	    {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":140},"GB_{yao}":{"x":100,"y":50,"width":90,"height":40},"KEYS_0":{"x":320,"y":20,"width":90,"height":40},"KEYS_{d}":{"x":320,"y":80,"width":90,"height":40}},"edges":{"@oracles_interface":{"KEYS_0":"exitX=1;exitY=0.2;entryX=0;entryY=0.2;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB_{yao}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_{d}":"exitX=1;exitY=0.8;entryX=0.2;entryY=0.6;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB_{yao}":{"KEYS_0":"exitX=0.8;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS_{d}":"exitX=0.8;exitY=0.6;entryX=0.2;entryY=0.4;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}}
	    }
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
	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":-10,"y":0,"width":20,"height":160},"SIM_{yao}":{"x":170,"y":60,"width":90,"height":40},"EV_{1..d}":{"x":440,"y":60,"width":90,"height":40},"BITS":{"x":600,"y":10,"width":90,"height":40},"KEYS":{"x":600,"y":100,"width":90,"height":40}},"edges":{"@oracles_interface":{"BITS":"exitX=0.999;exitY=0.111;entryX=0;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","SIM_{yao}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.888;exitY=0.777;entryX=0;entryY=0.777;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"SIM_{yao}":{"BITS":"exitX=0.777;exitY=0.333;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_{1..d}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.888;exitY=0.777;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"EV_{1..d}":{"BITS":"exitX=0.666;exitY=0.444;entryX=0;entryY=0.777;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS":"exitX=0.666;exitY=0.555;entryX=0;entryY=0.222;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}}
	    }
	},

	"SEC^0(GB_{yao})-unrolled":
	{
	    "oracles": [["KEYS_0","SETBIT"],["KEYS_0","GETA^{out}"],["GB^0_{yao,1}","GBL_1"],["GB^0_{yao,2}","GBL_2"], ["GB^0_{yao,3}","GBL_3"], ["GB^0_{yao,d}","GBL_d"], ["KEYS_{d}", "GETKEYS^{in}"]],
	    "graph":
	    {
		"GB^0_{yao,1}": [["KEYS_0","GETKEYS^{in}"],["KEYS_1","GETKEYS^{out}"]],
		"KEYS_0": [],
		"KEYS_1": [],
		"GB^0_{yao,2}": [["KEYS_1","GETKEYS^{in}"],["KEYS_2","GETKEYS^{out}"]],
		"KEYS_2": [],
		"KEYS_3": [],
		"GB^0_{yao,3}": [["KEYS_2","GETKEYS^{in}"],["KEYS_3","GETKEYS^{out}"]],
		"GB^0_{yao,d}": [["KEYS_{d-1}","GETKEYS^{in}"],["KEYS_{d}","GETKEYS^{out}"]],
		"KEYS_{d-1}": [],
		"KEYS_{d}": []
	    },
	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":340},"GB^0_{yao,1}":{"x":110,"y":50,"width":90,"height":50},"KEYS_0":{"x":320,"y":40,"width":90,"height":30},"KEYS_1":{"x":320,"y":90,"width":90,"height":30},"GB^0_{yao,2}":{"x":110,"y":110,"width":90,"height":50},"KEYS_2":{"x":320,"y":150,"width":90,"height":30},"KEYS_3":{"x":320,"y":190,"width":90,"height":30},"GB^0_{yao,3}":{"x":110,"y":170,"width":90,"height":50},"GB^0_{yao,d}":{"x":110,"y":260,"width":90,"height":50},"KEYS_{d-1}":{"x":320,"y":240,"width":90,"height":30},"KEYS_{d}":{"x":320,"y":299,"width":90,"height":30}},"edges":{"@oracles_interface":{"KEYS_0":"entryX=0;entryY=0.111;exitX=0.999;exitY=0.111;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB^0_{yao,1}":"exitX=0.999;exitY=0.222;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{yao,2}":"exitX=0.666;exitY=0.464;entryX=0;entryY=0.444;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB^0_{yao,3}":"exitX=0.999;exitY=0.555;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{yao,d}":"exitX=0.888;exitY=0.777;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS_{d}":"entryX=0;entryY=0.777;exitX=0.999;exitY=0.94;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{yao,1}":{"KEYS_0":"exitX=0.999;exitY=0.222;entryX=0;entryY=0.666;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_1":"exitX=0.888;exitY=0.777;entryX=0;entryY=0.111;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{yao,2}":{"KEYS_1":"exitX=0.777;exitY=0.333;entryX=0.222;entryY=0.666;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_2":"exitX=0.888;exitY=0.777;entryX=0.111;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{yao,3}":{"KEYS_2":"exitX=0.999;exitY=0.111;entryX=0.111;entryY=0.777;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_3":"exitX=0.999;exitY=0.777;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"GB^0_{yao,d}":{"KEYS_{d-1}":"exitX=0.999;exitY=0.111;entryX=0;entryY=0.777;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_{d}":"exitX=0.777;exitY=0.666;entryX=0.222;entryY=0.333;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}}

	    }
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

	    "layout": {
"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":660},"KEYS_1":{"x":550,"y":10,"width":90,"height":40},"KEYS":{"x":550,"y":610,"width":90,"height":40},"KEYS_2":{"x":550,"y":100,"width":90,"height":40},"KEYS_{i-1}":{"x":550,"y":160,"width":90,"height":40},"KEYS_i":{"x":550,"y":260,"width":90,"height":40},"KEYS_{i+1}":{"x":550,"y":340,"width":90,"height":40},"KEYS_{i+2}":{"x":550,"y":430,"width":90,"height":40},"KEYS_{i+3}":{"x":550,"y":510,"width":90,"height":40},"KEYS_d":{"x":550,"y":560,"width":90,"height":40},"GB^1_{yao,1}":{"x":160,"y":50,"width":90,"height":60},"EV_1":{"x":410,"y":60,"width":90,"height":40},"GB^1_{yao,i-1}":{"x":160,"y":200,"width":90,"height":60},"EV_{i-1}":{"x":410,"y":210,"width":90,"height":40},"GB^1_{yao,i}":{"x":160,"y":290,"width":90,"height":60},"EV_i":{"x":410,"y":300,"width":90,"height":40},"GB^0_{yao,i+1}":{"x":160,"y":380,"width":90,"height":60},"GB^0_{yao,i+2}":{"x":160,"y":460,"width":90,"height":60},"GB^0_{yao,d}":{"x":160,"y":570,"width":90,"height":60}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=1;exitY=0.035;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB^1_{yao,1}":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{yao,i-1}":"exitX=0.65;exitY=0.45;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{yao,i}":"entryX=0;entryY=0.5;entryPerimeter=1;exitX=1;exitY=0.45;exitDx=0;exitDy=0;","GB^0_{yao,i+1}":"exitX=0.7;exitY=0.55;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{yao,i+2}":"exitX=0.95;exitY=0.7;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{yao,d}":"exitX=0.8;exitY=0.75;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS":"exitX=1;exitY=0.98;entryX=0.1;entryY=0.8;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^1_{yao,1}":{"KEYS_1":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_1":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_2":"exitX=0.7;exitY=0.65;entryX=0;entryY=0.65;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"EV_1":{"KEYS_1":"exitX=0.75;exitY=0.4;entryX=0;entryY=0.85;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_2":"exitX=0.65;exitY=0.6;exitDx=0;exitDy=0;entryX=0;entryY=0.25;entryDx=0;entryDy=0;"},"GB^1_{yao,i-1}":{"KEYS_{i-1}":"exitX=0.85;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_{i-1}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_i":"exitX=0.65;exitY=0.6;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"EV_{i-1}":{"KEYS_{i-1}":"exitX=0.65;exitY=0.45;entryX=0;entryY=0.85;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_i":"exitX=0.65;exitY=0.6;entryX=0;entryY=0.2;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"GB^1_{yao,i}":{"KEYS_i":"exitX=0.65;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","EV_i":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_{i+1}":"exitX=0.7;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"EV_i":{"KEYS_i":"exitX=0.75;exitY=0.4;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_{i+1}":"exitX=0.85;exitY=0.65;entryX=0.05;entryY=0.2;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"GB^0_{yao,i+1}":{"KEYS_{i+1}":"exitX=0.75;exitY=0.4;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_{i+2}":"exitX=0.85;exitY=0.6;entryX=0;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"GB^0_{yao,i+2}":{"KEYS_{i+2}":"exitX=0.7;exitY=0.45;entryX=0.05;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_{i+3}":"exitX=0.9;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"GB^0_{yao,d}":{"KEYS_d":"exitX=0.85;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS":"exitX=0.9;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"}}
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
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":200},"MODGB_i":{"x":70,"y":80,"width":90,"height":40},"SIM_{denc}":{"x":230,"y":60,"width":90,"height":80},"EV":{"x":380,"y":80,"width":90,"height":40},"KEYS_1":{"x":560,"y":10,"width":90,"height":40},"KEYS":{"x":560,"y":150,"width":90,"height":40}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=0.999;exitY=0.111;entryX=0;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","MODGB_i":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.999;exitY=0.888;exitDx=0;exitDy=0;entryX=0.111;entryY=0.666;entryDx=0;entryDy=0;"},"MODGB_i":{"SIM_{denc}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"SIM_{denc}":{"EV":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS":"exitX=0.888;exitY=0.777;exitDx=0;exitDy=0;entryX=0.222;entryY=0.444;entryDx=0;entryDy=0;","KEYS_1":"exitX=0.999;exitY=0.111;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"EV":{"KEYS_1":"exitX=0.666;exitY=0.444;entryX=0.222;entryY=0.666;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS":"exitX=0.666;exitY=0.555;entryX=0.111;entryY=0.222;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}}
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

	"Hop1" :
	{
	    "parent": "Claim1",
	    "contents": [
		{
		    "text": "(Reduction of circuit garbling to layer garbling)."
		},

		{
		    "graphs": [["SEC^0(GB_{yao})-unrolled"]]
		},
	    ],

	    "type":
	    {
		"reduction":
		{
		    "graph": "SEC^0(GB_{yao})-unrolled",
		    "cut": ["GB^0_{yao,1}", "KEYS_0", "KEYS_1"]
		}
	    }
	},

	"Hop2" :
	{
	    "parent": "Claim1",
	    "contents": [
		{
		    "text": "(Reduction of circuit garbling to layer garbling)."
		},

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

	"Hop3" :
	{
	    "parent": "Claim1",
	    "contents": [
		{
		    "text": "(Reduction of circuit garbling to layer garbling)."
		},

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


	"Hop4" :
	{
	    "parent": "Claim1",
	    "contents": [
		{
		    "text": "(Reduction of circuit garbling to layer garbling)."
		},

		{
		    "graphs": [["LSEC^1_{1..d}(GB^1_{yao})"]]
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

	"Hop5" :
	{
	    "parent": "Claim1",
	    "contents": [
		{
		    "text": "\\(SEC^1_{1..d}(GB^1_{yao})\\)"
		},

		{
		    "graphs": [["LSEC^1_{1..d}(GB^1_{yao})"]]
		},
	    ],
	},



	// "Claim2" :
	// {
	//     "parent": "Lemma1",
	//     "contents": [
	// 	{
	// 	    "text": "(Reduction of circuit garbling to layer garbling)."
	// 	},

	// 	// {
	// 	//     "graphs": [["Gyao-sec^0"], ["Gyao-sec^0-unrolled"]]
	// 	// },

	//     ],

	//     "type":
	//     {
	// 	"codeq": {
	// 	    "graph": "Gyao-sec^0-unrolled",
	// 	    "packages": ["GB^0_{yao,1}", "KEYS_{d-1}", "GB^0_{yao,d}"]
	// 	}
	//     }


	// },

	"Claim3" :
	{
	    "parent": "Lemma2",
	    "contents": [
		{
		    "text": "Layer security Real code equivalence (graphs in Real-Layer-reduction) and Real-Layer-GDENC)"
		},
	    ],
	},

	"Real-Layer-reduction" :
	{
	    "parent": "Claim3",
	    "contents": [
		{
		    "text": "Reduction \\(\\mathcal{R}_{layer,i}\\) highlighted with dotted line."
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

	"Real-Layer-GDENC" :
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
		    "text": "Layer security Ideal code equivalence."
		},
		// {
		//     "graphs": [["LSEC^1_i(SIM_{yao,i})"]]
		// }
	    ]
	},


	"Ideal-Layer-GDENC" :
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


	"Layer-simulator-reduction" :
	{
	    "parent": "Claim4",
	    "contents": [
		{
		    "text": "Reduction \\(\\mathcal{R}_{layer,i}\\) highlighted with dotted line."
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
		    "packages": ["MODGB_i", "SIM_{denc}"]
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
