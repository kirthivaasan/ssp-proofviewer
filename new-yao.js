function newyao_driver() {
    var proof_name = "Game-based security and simulation-based security equivalence of IND-CPA for symmetric encryption";

    var monolithic_pkgs = {
	"KEYS":
	{
	    "oracles":
	    {
		"SETBIT" :
		{
		    "code": "@assert z = @bot;z @gets z';@return ();",
		    "params": ["z'"]
		},

		"GETBIT" :
		{
		    "code": "@assert z \\neq @bot;@return z",
		    "params": []
		},

		"GETA^{out}" :
		{
		    "code": "@assert z \\neq @bot;\\mathsf{flag} @gets 1;@if Z = @bot @then;    Z(0) @sample \\{0,1\\}^\\lambda;    Z(1) @sample \\{0,1\\}^\\lambda;@return Z(z);",
		    "params": []
		},

		"GETA^{in}" :
		{
		    "code": "@assert \\mathsf{flag};@return Z(z)",
		    "params": []
		},

		"GETINA^{in}" :
		{
		    "code": "@assert \\mathsf{flag};@return Z(1-z)",
		    "params": []
		},

		"GETKEYS^{in}" :
		{
		    "code": "@assert \\mathsf{flag};@return Z;",
		    "params": []
		},

		"GETKEYS^{out}" :
		{
		    "code": "@assert \\mathsf{flag} = 0;\\mathsf{flag} @gets 1;@if Z = @bot @then;    Z(0) @sample \\{0,1\\}^\\lambda;    Z(1) @sample \\{0,1\\}^\\lambda;@return Z",
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

	"KEYS_d":
	{
	    "instance": "KEYS"
	},

	"KEYS_{d+1}":
	{
	    "instance": "KEYS"
	},

	"LEV_j":
	{
	    "oracles":
	    {
		"EVAL_j" :
		{
		    "code": "z_{\\ell} @gets \\mathsf{GETBIT}_{\\ell};z_{r} @gets \\mathsf{GETBIT}_{r};z_j @gets op(z_{i-1,\\ell}, z_{i-1,r});\\mathsf{SETBIT}_j(z_j)",
		    "params": ["\\ell", "r", "op"]
		},

	    }
	},

	"LEV_{n,1}":
	{
	    "instance": "LEV_j"
	},

	"LEV_{n,2}":
	{
	    "instance": "LEV_j"
	},

	"LEV_{n,d}":
	{
	    "instance": "LEV_j"
	},

	"LEV_{n,i-1}":
	{
	    "instance": "LEV_j"
	},

	"LEV_{n,i}":
	{
	    "instance": "LEV_j"
	},

	"MODGB_{n,i}":
	{
	    "oracles":
	    {
		"GBL_i" :
		{
		    "code": "@assert \\tilde{C}[i] = \\bot;@assert |\\boldsymbol{\\ell}|, |\\boldsymbol{r}|, |\\boldsymbol{op}| = n;@for j = 1..n @do;    (\\ell,r,op)  @gets  (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));\\tilde{C}[i]_j @gets \\mathsf{GBLG}(\\ell, r, op, j);\\tilde{C}[i] @gets \\tilde{C}[i]_{1..n};@return \\tilde{C}[i]",
		    "params": ["\\boldsymbol{\\ell}", "\\boldsymbol{r}", "\\boldsymbol{op}"]
		},

	    }
	},

	"GATE_n":
	{
	    "oracles":
	    {
		"GBLG" :
		{
		    "code": "\\tilde{C}_j @gets \\bot;Z^{out}_j @gets \\mathsf{GETKEYS}^{out}_j;@for (b_{\\ell},b_r) \\in \\{0,1\\}^2;@> b_j @gets op(b_{\\ell}, b_r);@> k^0_j @gets Z^{out}_j(b_j);@> c^0_{in} @gets \\mathsf{ENC}_{\ell}(b^{\\ell},k^0_j,0^\\lambda);@> c^1_{in} @gets \\mathsf{ENC}_{\ell}(b^{\\ell},0^\\lambda,0^\\lambda);@> c @gets \\mathsf{ENC}_r(b^r, c^0_{in}, c^1_{in});@> \\tilde{C}_j @gets \\tilde{C}_j \\cup c;@return \\tilde{C}_j;",
		    "params": ["\\ell", "r", "op", "j"]
		},

	    }
	},

	"ENC^b":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": "Z^{in} @gets \\mathsf{GETKEYS}^{in}();@assert |m_0| = |m_1|;c @sample enc(Z^{in}(d), m_0);@if b = 1:;@> z^{in} @gets \\mathsf{GETBIT}();@> @if z^{in} \\neq d @then;@> @> c @sample enc(Z^{in}(d), m_b);@return c",
		    "params": ["d", "m_0", "m_1"]
		}
	    }
	},

	"ENC^0_{1,n}":
	{
	    "instance": "ENC^b"
	},

	"ENC^1_{1,n}":
	{
	    "instance": "ENC^b"
	},

	"SIM_{gate,n}":
	{
	    "oracles":
	    {
		"GBLG":
		{
		    "code": "\\tilde{g}_j @gets @bot;\\mathsf{EVAL}(j,\\ell,r,op);S_j^{out}(0) @gets \\mathsf{GETA}^{out}_j;S_r^{in}(0) @gets \\mathsf{GETA}^{in}_r;S_r^{in}(1) @gets \\mathsf{GETINA}^{in}_r;S_{\\ell}^{in}(0) @gets \\mathsf{GETA}^{in}_{\\ell};S_{\\ell}^{in}(1) @gets \\mathsf{GETINA}^{in}_{\\ell};@for (d_{\\ell},d_r) \\in \\{0,1\\}^2 @do;@> k^{in}_{\\ell} @gets S^{in}_{\\ell}(d_{\\ell});@> k^{in}_r @gets S^{in}_r(d_r);@> @if d_{\\ell} = d_r = 0 @then;@> @> k^{out}_j @gets S^{out}_j(0);@> @else k_j @gets 0^{\\lambda};@> c_{in} @sample enc(k^{in}_r, k^{out}_j);@> c @sample enc_{k^{in}_{\\ell}}(c_{in});@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j;",
		    "params": ["\\ell", "r", "op", "j"]
		}
	    }
	}



    };


    var modular_pkgs = {
	"PRVSIM^0(GB, DINF)":
	{
	    "oracles": [["MOD-PRIVSIM^0", "GARBLE"]],
	    "graph":
	    {
		"MOD-PRIVSIM^0": [["EN", "SETBIT_{1,...,n}|GETA^{out}_{1,...,n}"], ["GB", "GBL"], ["DINF", "GETDINF"]],
		"EN": [["EKEYS_{1,...,n}", "GETKEYS_{1,...,n}"]],
		"GB": [["EKEYS_{1,...,n}", "SETKEYS_{1,...,n}"], ["DINF", "SETDINF"]],
		"DINF": [],
		"EKEYS_{1,...,n}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":130},"MOD-PRIVSIM^0":{"x":80,"y":0,"width":90,"height":130},"EN":{"x":260,"y":0,"width":90,"height":50},"GB":{"x":260,"y":60,"width":90,"height":50},"DINF":{"x":500,"y":80,"width":90,"height":50},"EKEYS_{1,...,n}":{"x":500,"y":20,"width":90,"height":50}},"edges":{"@oracles_interface":{"MOD-PRIVSIM^0":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"MOD-PRIVSIM^0":{"EN":"exitX=0.65;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB":"exitX=1;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","DINF":"exitX=0.8;exitY=0.75;entryX=0.1;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"EN":{"EKEYS_{1,...,n}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;"},"GB":{"EKEYS_{1,...,n}":"exitX=0.85;exitY=0.3;entryX=0.05;entryY=0.85;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","DINF":"exitX=0.85;exitY=0.7;entryX=0;entryY=0.4;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[],"MOD-PRIVSIM^0":[],"EN":[],"GB":[]}}
	},

	"PRVSIM^1(SIM)":
	{
	    "oracles": [["MOD-PRIVSIM^1", "GARBLE"]],
	    "graph":
	    {
		"MOD-PRIVSIM^1": [["BITS_1", "SETBIT_{1,...,n}"], ["EV", "EVAL"], ["SIM", "GETDINF|GETA^{out}_{1,...,n}|GBL"]],
		"EV": [["BITS_1", "GETBIT_{1,...,n}"], ["BITS_n", "SETBIT_{1,...,n}"]],
		"SIM": [["BITS_n", "GETBIT_{1,...,n}"]],
		"BITS_1": [],
		"BITS_n": []
	    },
	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":120},"MOD-PRIVSIM^1":{"x":80,"y":0,"width":90,"height":120},"EV":{"x":360,"y":30,"width":90,"height":50},"SIM":{"x":260,"y":70,"width":90,"height":50},"BITS_1":{"x":500,"y":0,"width":90,"height":50},"BITS_n":{"x":500,"y":60,"width":90,"height":50}},"edges":{"@oracles_interface":{"MOD-PRIVSIM^1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"MOD-PRIVSIM^1":{"BITS_1":"exitX=0.9;exitY=0.15;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","EV":"exitX=1;exitY=0.45;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","SIM":"exitX=0.75;exitY=0.65;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"EV":{"BITS_1":"exitX=0.85;exitY=0.25;entryX=0;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","BITS_n":"exitX=0.75;exitY=0.65;entryX=0.1;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"SIM":{"BITS_n":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0.05;entryY=0.7;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"MOD-PRIVSIM^1":[],"EV":[],"SIM":[]}}
	},

	"MOD^0->SEC^0_{n,d}(GB_{yao,n,d})":
	{
	    "oracles": [["MOD", "GARBLE"]],
	    "graph":
	    {
		"MOD": [["KEYS_{1,...,d}", "SETBIT_{1,...,n}|GETA^{out}_{1,...,n}"], ["GB_{yao,n,d}", "GB_{yao,n,d}L"], ["KEYS_{d+1}", "GETKEYS^{in}_{1,...,n}"]],
		"GB_{yao,n,d}": [["KEYS_{1,...,d}", "SETKEYS_{1,...,n}"], ["KEYS_{d+1}", "GETKEYS^{out}_{1,...,n}"]],
		"KEYS_{1,...,d}": [],
		"KEYS_{d+1}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":130},"MOD":{"x":80,"y":0,"width":90,"height":130},"GB_{yao,n,d}":{"x":260,"y":60,"width":90,"height":50},"KEYS_{d+1}":{"x":500,"y":80,"width":90,"height":50},"KEYS_{1,...,d}":{"x":500,"y":20,"width":90,"height":50}},"edges":{"@oracles_interface":{"MOD":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"MOD":{"KEYS_{1,...,d}":"exitX=0.65;exitY=0.415;entryX=0;entryY=0.15;entryPerimeter=1;exitDx=0;exitDy=0;","GB_{yao,n,d}":"exitX=1;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS_{d+1}":"exitX=0.8;exitY=0.75;entryX=0.1;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"EN":{"KEYS_{1,...,d}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;"},"GB_{yao,n,d}":{"KEYS_{1,...,d}":"exitX=0.85;exitY=0.3;entryX=0.05;entryY=0.85;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_{d+1}":"exitX=0.85;exitY=0.7;entryX=0;entryY=0.4;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[],"MOD":[],"EN":[],"GB_{yao,n,d}":[]}}
	},

	"MOD_{n,d}->SEC^1_{n,d}(SIM_{yao,n,d})":
	{
	    "oracles": [["MOD", "GARBLE"]],
	    "graph":
	    {
		"MOD": [["KEYS_1", "SETBIT_{1,...,n},GETA^{out}_{1,...,n}"], ["GB^1_{n,1}", "GBL_1"], ["GB^1_{n,2}", "GBL_2"], ["GB^1_{n,d}", "GBL_d"], ["KEYS_{d+1}", "GETKEYS^{in}_{1,...,n}"]],
		"KEYS_1": [],
		"KEYS_2": [],
		"GB^1_{n,1}": [["KEYS_1", "GETINA^{in}_{1,...,n}"], ["LEV_{n,1}", "EVAL"], ["KEYS_2", "GETA^{out}_{1,...,n}"]],
		"LEV_{n,1}": [["KEYS_1", "GETBIT_{1,...,n}"], ["KEYS_2", "SETBIT_{1,...,n}"]],
		"KEYS_3": [],
		"GB^1_{n,2}": [["KEYS_2", "GETINA^{in}_{1,...,n}"], ["LEV_{n,2}", "EVAL"], ["KEYS_3", "GETA^{out}_{1,...,n}"]],
		"LEV_{n,2}": [["KEYS_2", "GETBIT_{1,...,n}"], ["KEYS_3", "SETBIT_{1,...,n}"]],
		"GB^1_{n,d}": [["KEYS_d", "GETINA^{in}_{1,...,n}"], ["LEV_{n,d}", "EVAL"], ["KEYS_{d+1}", "GETA^{out}_{1,...,n}"]],
		"LEV_{n,d}": [["KEYS_d", "GETBIT_{1,...,n}"], ["KEYS_{d+1}", "SETBIT_{1,...,n}"]],
		"KEYS_d": [],
		"KEYS_{d+1}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":330}, "MOD":{"x":80,"y":0,"width":40,"height":330},"KEYS_1":{"x":500,"y":0,"width":90,"height":50},"KEYS_2":{"x":500,"y":60,"width":90,"height":50},"GB^1_{n,1}":{"x":160,"y":30,"width":90,"height":50, "color":"blue"},"LEV_{n,1}":{"x":320,"y":30,"width":90,"height":50},"KEYS_3":{"x":500,"y":120,"width":90,"height":50},"GB^1_{n,2}":{"x":160,"y":100,"width":90,"height":50, "color":"blue"},"LEV_{n,2}":{"x":320,"y":100,"width":90,"height":50},"GB^1_{n,d}":{"x":160,"y":250,"width":90,"height":50, "color":"blue"},"LEV_{n,d}":{"x":320,"y":250,"width":90,"height":50},"KEYS_d":{"x":500,"y":220,"width":90,"height":50},"KEYS_{d+1}":{"x":500,"y":280,"width":90,"height":50}},"edges":{"@oracles_interface":{"MOD":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"MOD":{"KEYS_1":"exitX=0.95;exitY=0.07;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB^1_{n,1}":"exitX=0.65;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{n,2}":"exitX=0.95;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{n,d}":"exitX=0.65;exitY=0.6;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS_{d+1}":"entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitX=0.95;exitY=0.92;exitDx=0;exitDy=0;"},"GB^1_{n,1}":{"KEYS_1":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.45;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","LEV_{n,1}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;", "KEYS_2":"exitX=1;exitY=0.75;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"LEV_{n,1}":{"KEYS_1":"exitX=0.6;exitY=0.45;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_2":"exitX=0.75;exitY=0.65;entryX=0.1;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"GB^1_{n,2}":{"KEYS_2":"exitX=1;exitY=0.25;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","LEV_{n,2}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_3":"exitX=0.85;exitY=0.65;entryX=0.05;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"LEV_{n,2}":{"KEYS_2":"exitX=0.85;exitY=0.25;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_3":"exitX=0.8;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^1_{n,d}":{"KEYS_d":"exitX=0.75;exitY=0.35;entryX=0;entryY=0.4;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","LEV_{n,d}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_{d+1}":"exitX=0.75;exitY=0.65;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"LEV_{n,d}":{"KEYS_d":"exitX=0.85;exitY=0.3;entryX=0.05;entryY=0.7;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_{d+1}":"exitX=0.9;exitY=0.75;entryX=0.05;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}},"edge_points":{"MOD":[],"GB^1_{n,1}":[{"x":280,"y":50}],"LEV_{n,1}":[],"GB^1_{n,2}":[{"x":280,"y":150}],"LEV_{n,2}":[],"GB^1_{n,d}":[{"x":290,"y":300}],"LEV_{n,d}":[]}},

	    "ghost":
	    {
		"KEYS_3": {"x":250, "y":165, "style":"exitX=0;exitY=0;entryX=0;entryY=0.9;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},
		"KEYS_d": {"x": 250, "y":227, "style":"exitX=0.999;exitY=0.05;entryX=0.111;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}
	    },

	    "decoration":
	    {
		"vellipses": [{"x":200, "y":180}, {"x":540, "y":180}]
	    }


	},

	"LSEC^0_{n,i}(GB^0_{yao,n,i})":
	{
	    "oracles": [["KEYS_i", "GETA^{out}_{1,...,n},SETBIT_{1,...,n}"], ["MODGB_{n,i}", "GBL_i"], ["KEYS_{i+1}", "GETKEYS^{in}_{1,...,n}"]],
	    "graph":
	    {
		"KEYS_i": [],
		"MODGB_{n,i}": [["GATE_n", "GBLG"]],
		"GATE_n": [["ENC^0_{1,n}", "ENC_{1,...,n}"], ["KEYS_{i+1}", "GETKEYS^{out}_{1,...,n}"]],
		"ENC^0_{1,n}": [["KEYS_i", "GETKEYS^{in}_{1,...,n}"]],
		"KEYS_{i+1}": []
	    },
	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":110},"KEYS_i":{"x":590,"y":0,"width":90,"height":50},"MODGB_{n,i}":{"x":110,"y":30,"width":90,"height":50},"GATE_n":{"x":260,"y":30,"width":90,"height":50},"ENC^0_{1,n}":{"x":420,"y":20,"width":90,"height":50},"KEYS_{i+1}":{"x":590,"y":60,"width":90,"height":50}},"edges":{"@oracles_interface":{"KEYS_i":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","MODGB_{n,i}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_{i+1}":"exitX=0.8;exitY=0.75;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"MODGB_{n,i}":{"GATE_n":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"GATE_n":{"ENC^0_{1,n}":"exitX=0.85;exitY=0.35;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS_{i+1}":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"ENC^0_{1,n}":{"KEYS_i":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0.05;entryY=0.85;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"MODGB_{n,i}":[],"GATE_n":[],"ENC^0_{1,n}":[]}}
	},

	"HYB_{n,i}":
	{
	    "oracles": [["KEYS_i", "GETA^{out}_{1,...,n},SETBIT_{1,...,n}"], ["MODGB_{n,i}", "GBL_i"], ["KEYS_{i+1}", "GETKEYS^{in}_{1,...,n}"]],
	    "graph":
	    {
		"KEYS_i": [],
		"MODGB_{n,i}": [["GATE_n", "GBLG"]],
		"GATE_n": [["ENC^1_{1,n}", "ENC_{1,...,n}"], ["KEYS_{i+1}", "GETKEYS^{out}_{1,...,n}"]],
		"ENC^1_{1,n}": [["KEYS_i", "GETKEYS^{in}_{1,...,n}"]],
		"KEYS_{i+1}": []
	    },
	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":110},"KEYS_i":{"x":590,"y":0,"width":90,"height":50},"MODGB_{n,i}":{"x":110,"y":30,"width":90,"height":50},"GATE_n":{"x":260,"y":30,"width":90,"height":50},"ENC^1_{1,n}":{"x":420,"y":20,"width":90,"height":50},"KEYS_{i+1}":{"x":590,"y":60,"width":90,"height":50}},"edges":{"@oracles_interface":{"KEYS_i":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","MODGB_{n,i}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_{i+1}":"exitX=0.8;exitY=0.75;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"MODGB_{n,i}":{"GATE_n":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"GATE_n":{"ENC^1_{1,n}":"exitX=0.85;exitY=0.35;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS_{i+1}":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"ENC^1_{1,n}":{"KEYS_i":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0.05;entryY=0.85;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"MODGB_{n,i}":[],"GATE_n":[],"ENC^1_{1,n}":[]}}
	},

	"LSEC^1_{n,i}(GB^1_{yao,n,i})":
	{
	    "oracles": [["KEYS_i", "GETA^{out}_{1,...,n},SETBIT_{1,...,n}"], ["MODGB_{n,i}", "GBL_i"], ["KEYS_{i+1}", "GETKEYS^{in}_{1,...,n}"]],
	    "graph":
	    {
		"KEYS_i": [],
		"MODGB_{n,i}": [["SIM_{gate,n}", "GBLG"]],
		"SIM_{gate,n}": [["LEV_{n,i}", "EVAL"], ["KEYS_i", "GETA^{in},GETINA^{in}_{1,...,n}"], ["KEYS_{i+1}", "GETA^{out}_{1,...,n}"]],
		"LEV_{n,i}": [["KEYS_i", "GETBIT_{1,...,n}"], ["KEYS_{i+1}", "SETBIT_{1,...,n}"]],
		"KEYS_{i+1}": []
	    },
	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":110},"KEYS_i":{"x":590,"y":0,"width":90,"height":50},"MODGB_{n,i}":{"x":110,"y":30,"width":90,"height":50},"SIM_{gate,n}":{"x":260,"y":30,"width":90,"height":50},"LEV_{n,i}":{"x":420,"y":30,"width":90,"height":50},"KEYS_{i+1}":{"x":590,"y":60,"width":90,"height":50}},"edges":{"@oracles_interface":{"KEYS_i":"exitX=0.8;exitY=0.25;entryX=0;entryY=0.15;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","MODGB_{n,i}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_{i+1}":"exitX=0.75;exitY=0.7;entryX=0;entryY=0.8;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"MODGB_{n,i}":{"SIM_{gate,n}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"SIM_{gate,n}":{"LEV_{n,i}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_i":"exitX=0.65;exitY=0.4;entryX=0.05;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_{i+1}":"exitX=0.75;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"LEV_{n,i}":{"KEYS_i":"exitX=0.75;exitY=0.35;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_{i+1}":"exitX=0.75;exitY=0.6;entryX=0;entryY=0.15;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[],"MODGB_{n,i}":[],"SIM_{gate,n}":[{"x":410,"y":50}],"LEV_{n,i}":[]}}
	},

	"SEC^0_{n,d}(GB_{yao,n,d})":
	{

	    "oracles": [["KEYS_1", "SETBIT_{1,...,n},GETA^{out}_{1,...,n}"], ["GB^0_{n,1}", "GBL_1"], ["GB^0_{n,2}", "GBL_2"], ["GB^0_{n,d}", "GBL_d"], ["KEYS_{d+1}", "GETKEYS^{in}_{1,...,n}"]],
	    "graph":
	    {
		"KEYS_1": [],
		"KEYS_2": [],
		"GB^0_{n,1}": [["KEYS_1", "GETKEYS^{in}_{1,...,n}"], ["KEYS_2", "GETKEYS^{out}_{1,...,n}"]],
		"KEYS_3": [],
		"GB^0_{n,2}": [["KEYS_2", "GETKEYS^{in}_{1,...,n}"], ["KEYS_3", "GETKEYS^{out}_{1,...,n}"]],
		"KEYS_d": [],
		"KEYS_{d+1}": [],
		"GB^0_{n,d}": [["KEYS_d", "GETKEYS^{in}_{1,...,n}"], ["KEYS_{d+1}", "GETKEYS^{out}_{1,...,n}"]]
	},

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":320},"KEYS_1":{"x":360,"y":0,"width":90,"height":50},"KEYS_2":{"x":360,"y":60,"width":90,"height":50},"GB^0_{n,1}":{"x":160,"y":30,"width":90,"height":50, "color":"yellow"},"KEYS_3":{"x":360,"y":120,"width":90,"height":50},"GB^0_{n,2}":{"x":160,"y":90,"width":90,"height":50, "color":"yellow"},"KEYS_d":{"x":360,"y":210,"width":90,"height":50},"KEYS_{d+1}":{"x":360,"y":270,"width":90,"height":50},"GB^0_{n,d}":{"x":160,"y":240,"width":90,"height":50, "color":"yellow"}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=1;exitY=0.05;entryX=0.1;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB^0_{n,1}":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{n,2}":"exitX=0.85;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^0_{n,d}":"exitX=0.9;exitY=0.75;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS_{d+1}":"exitX=1;exitY=0.95;entryX=0;entryY=0.8;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{n,1}":{"KEYS_1":"exitX=0.65;exitY=0.4;entryX=0.05;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_2":"exitX=0.75;exitY=0.65;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{n,2}":{"KEYS_2":"exitX=0.75;exitY=0.35;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_3":"exitX=0.85;exitY=0.7;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{n,d}":{"KEYS_d":"exitX=0.65;exitY=0.4;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_{d+1}":"exitX=0.9;exitY=0.75;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"GB^0_{n,1}":[],"GB^0_{n,2}":[],"GB^0_{n,d}":[]}},

	    "ghost":
	    {
		"KEYS_3": {"x":250, "y":165, "style":"exitX=0;exitY=0;entryX=0;entryY=0.9;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},
		"KEYS_d": {"x": 250, "y":217, "style":"exitX=0.999;exitY=0.05;entryX=0.111;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}
	    },

	    "decoration":
	    {
		"vellipses": [{"x":200, "y":175}, {"x":400, "y":175}]
	    }

	},

	"H_i":
	{
	    "oracles": [["KEYS_1", "GETA_{1,...,n},SETBIT_{1,...,n}"], ["GB^1_1", "GBL_1"], ["GB^1_{i-1}", "GBL_{i-1}"], ["GB^1_i", "GBL_i"], ["GB^0_{n,i+1}", "GBL_{n,i+1}"], ["GB^0_{n,i+2}", "GBL_{n,i+2}"], ["GB^0_{n,d}", "GBL_d"], ["KEYS_{d+1}", "GETKEYS^{in}_{1,...,n}"]],
	    "graph":
	    {
		"GB^1_1": [["KEYS_1", "GETINA^{in}_{1,...,n}"], ["LEV_1", "EVAL"], ["KEYS_2", "GETA^{out}_{1,...,n}"]],
		"LEV_{n,1}": [["KEYS_1", "GETBIT_{1,...,n}"], ["KEYS_2", "SETBIT_{1,...,n}"]],
		"KEYS_1": [],
		"KEYS_2": [],
		"GB^1_{i-1}":[["KEYS_{i-1}", "GETINA^{in}_{1,...,n}"], ["LEV_{n,i-1}", "EVAL"], ["KEYS_i", "GETA^{out}_{1,...,n}"]],
		"LEV_{n,i-1}": [["KEYS_{i-1}", "GETBIT_{1,...,n}"], ["KEYS_i", "SETBIT_{1,...,n}"]],
		"KEYS_{i-1}": [],
		"KEYS_i": [],
		"GB^1_i": [["KEYS_i", "GETA_{1,...,n}, GETINA^{in}_{1,...,n}"], ["LEV_{n,i}", "EVAL"], ["KEYS_{i+1}", "GETA^{out}_{1,...,n}"]],
		"LEV_{n,i}": [["KEYS_i", "GETBIT_{1,...,n}"], ["KEYS_{i+1}", "SETBIT_{1,...,n}"]],
		"KEYS_{i+1}": [],
		"KEYS_{i+2}": [],
		"GB^0_{n,i+1}": [["KEYS_{i+1}", "GETKEYS_{1,...,n}"], ["KEYS_{i+2}", "SETKEYS_{1,...,n}"]],
		"KEYS_{i+3}": [],
		"GB^0_{n,i+2}": [["KEYS_{i+2}", "GETKEYS_{1,...,n}"], ["KEYS_{i+3}", "SETKEYS_{1,...,n}"]],
		"KEYS_d": [],
		"KEYS_{d+1}": [],
		"GB^0_{n,d}": [["KEYS_d", "GETKEYS_{1,...,n}"], ["KEYS_{d+1}", "SETKEYS_{1,...,n}"]],
	    },

	    "ghost":
	    {
		"KEYS_2": {"x":200, "y":105, "style":"exitX=0;exitY=0;entryX=0;entryY=0.9;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},
		"KEYS_{i-1}": {"x": 200, "y":167, "style":"exitX=0.999;exitY=0.05;entryX=0.111;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},
		"KEYS_{i+3}": {"x":200, "y":445, "style":"exitX=0;exitY=0;entryX=0;entryY=0.9;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},
		"KEYS_d": {"x": 200, "y":507, "style":"exitX=0.999;exitY=0.05;entryX=0.111;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}
	    },

	    "decoration":
	    {
		"vellipses": [{"x":120, "y":120}, {"x":520, "y":120}, {"x":120, "y":460}, {"x":520, "y":460}]
	    },

	    "layout":{"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":600},"GB^1_1":{"x":80,"y":30,"width":90,"height":50, "color":"blue"},"LEV_{n,1}":{"x":260,"y":30,"width":90,"height":50},"KEYS_1":{"x":480,"y":0,"width":90,"height":50},"KEYS_2":{"x":480,"y":60,"width":90,"height":50},"GB^1_{i-1}":{"x":80,"y":190,"width":90,"height":50, "color":"blue"},"LEV_{n,i-1}":{"x":270,"y":190,"width":90,"height":50},"KEYS_{i-1}":{"x":480,"y":160,"width":90,"height":50},"KEYS_i":{"x":480,"y":220,"width":90,"height":50},"GB^1_i":{"x":80,"y":260,"width":90,"height":50, "color":"blue"},"LEV_{n,i}":{"x":270,"y":260,"width":90,"height":50},"KEYS_{i+1}":{"x":480,"y":280,"width":90,"height":50},"KEYS_{i+2}":{"x":480,"y":340,"width":90,"height":50},"GB^0_{n,i+1}":{"x":270,"y":330,"width":90,"height":50, "color":"yellow"},"KEYS_{i+3}":{"x":480,"y":400,"width":90,"height":50},"GB^0_{n,i+2}":{"x":270,"y":390,"width":90,"height":50, "color":"yellow"},"KEYS_d":{"x":480,"y":500,"width":90,"height":50},"KEYS_{d+1}":{"x":480,"y":560,"width":90,"height":50},"GB^0_{n,d}":{"x":270,"y":530,"width":90,"height":50, "color":"yellow"}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=0.95;exitY=0.07;entryX=0.1;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB^1_1":"exitX=0.75;exitY=0.3;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{i-1}":"exitX=1;exitY=0.35;exitDx=0;exitDy=0;entryX=0.05;entryY=0.5;entryDx=0;entryDy=0","GB^1_i":"exitX=0.75;exitY=0.486;entryX=0.05;entryY=0.5;entryDx=0;entryDy=0;","GB^0_{n,i+1}":"exitX=0.75;exitY=0.545;entryX=0.05;entryY=0.5;entryDx=0;entryDy=0;","GB^0_{n,i+2}":"exitX=0.75;exitY=0.595;entryX=0;entryY=0.5;entryDx=0;entryDy=0;","GB^0_{n,d}":"exitX=0.75;exitY=0.713;entryX=0;entryY=0.5;entryDx=0;entryDy=0;","KEYS_{d+1}":"exitX=0.75;exitY=0.74;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"},"GB^1_1":{"KEYS_1":"exitX=0.65;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","LEV_{n,1}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_2":"exitX=0.9;exitY=0.75;entryX=0;entryY=0.6;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"LEV_{n,1}":{"KEYS_1":"exitX=0.75;exitY=0.4;entryX=0;entryY=0.85;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_2":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^1_{i-1}":{"KEYS_{i-1}":"exitX=0.85;exitY=0.3;entryX=0.05;entryY=0.45;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","LEV_{n,i-1}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_i":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.6;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"LEV_{n,i-1}":{"KEYS_{i-1}":"exitX=0.85;exitY=0.3;entryX=0.1;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_i":"entryX=0.1;entryY=0.2;exitX=0.85;exitY=0.65;exitDx=0;exitDy=0;"},"GB^1_i":{"KEYS_i":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.6;entryDx=0;entryDy=0;","LEV_{n,i}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_{i+1}":"exitX=0.85;exitY=0.75;entryX=0.1;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"LEV_{n,i}":{"KEYS_i":"exitX=0.8;exitY=0.25;entryX=0.15;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_{i+1}":"exitX=0.75;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"GB^0_{n,i+1}":{"KEYS_{i+1}":"exitX=0.55;exitY=0.45;entryX=0;entryY=1;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_{i+2}":"exitX=0.85;exitY=0.7;entryX=0.05;entryY=0.6;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{n,i+2}":{"KEYS_{i+2}":"exitX=0.55;exitY=0.45;entryX=0.05;entryY=0.9;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_{i+3}":"exitX=0.65;exitY=0.6;entryX=0;entryY=0.65;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^0_{n,d}":{"KEYS_d":"exitX=0.8;exitY=0.25;entryX=0.1;entryY=0.65;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","KEYS_{d+1}":"exitX=0.75;exitY=0.65;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"GB^1_1":[{"x":200,"y":55}],"LEV_{n,1}":[],"GB^1_{i-1}":[{"x":240,"y":240}],"LEV_{n,i-1}":[],"GB^1_i":[{"x":230,"y":310}],"LEV_{n,i}":[],"GB^0_{n,i+1}":[],"GB^0_{n,i+2}":[],"GB^0_{n,d}":[]}}
	},

	"SEC^1_{n,d}(SIM_{yao,n,d})":
	{
	    "oracles": [["KEYS_1", "SETBIT_{1,...,n},GETA^{out}_{1,...,n}"], ["GB^1_{n,1}", "GBL_1"], ["GB^1_{n,2}", "GBL_2"], ["GB^1_{n,d}", "GBL_d"], ["KEYS_{d+1}", "GETKEYS^{in}_{1,...,n}"]],
	    "graph":
	    {
		"KEYS_1": [],
		"KEYS_2": [],
		"GB^1_{n,1}": [["KEYS_1", "GETINA^{in}_{1,...,n}"], ["LEV_{n,1}", "EVAL"], ["KEYS_2", "GETA^{out}_{1,...,n}"]],
		"LEV_{n,1}": [["KEYS_1", "GETBIT_{1,...,n}"], ["KEYS_2", "SETBIT_{1,...,n}"]],
		"KEYS_3": [],
		"GB^1_{n,2}": [["KEYS_2", "GETINA^{in}_{1,...,n}"], ["LEV_{n,2}", "EVAL"], ["KEYS_3", "GETA^{out}_{1,...,n}"]],
		"LEV_{n,2}": [["KEYS_2", "GETBIT_{1,...,n}"], ["KEYS_3", "SETBIT_{1,...,n}"]],
		"GB^1_{n,d}": [["KEYS_d", "GETINA^{in}_{1,...,n}"], ["LEV_{n,d}", "EVAL"], ["KEYS_{d+1}", "GETA^{out}_{1,...,n}"]],
		"LEV_{n,d}": [["KEYS_d", "GETBIT_{1,...,n}"], ["KEYS_{d+1}", "SETBIT_{1,...,n}"]],
		"KEYS_d": [],
		"KEYS_{d+1}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":330},"KEYS_1":{"x":480,"y":0,"width":90,"height":50},"KEYS_2":{"x":480,"y":60,"width":90,"height":50},"GB^1_{n,1}":{"x":140,"y":30,"width":90,"height":50, "color":"blue"},"LEV_{n,1}":{"x":320,"y":30,"width":90,"height":50},"KEYS_3":{"x":480,"y":120,"width":90,"height":50},"GB^1_{n,2}":{"x":140,"y":100,"width":90,"height":50, "color":"blue"},"LEV_{n,2}":{"x":320,"y":100,"width":90,"height":50},"GB^1_{n,d}":{"x":140,"y":250,"width":90,"height":50, "color":"blue"},"LEV_{n,d}":{"x":320,"y":250,"width":90,"height":50},"KEYS_d":{"x":480,"y":220,"width":90,"height":50},"KEYS_{d+1}":{"x":480,"y":280,"width":90,"height":50}},"edges":{"@oracles_interface":{"KEYS_1":"exitX=0.95;exitY=0.07;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","GB^1_{n,1}":"exitX=0.65;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{n,2}":"exitX=0.95;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","GB^1_{n,d}":"exitX=0.65;exitY=0.6;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","KEYS_{d+1}":"entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitX=0.95;exitY=0.92;exitDx=0;exitDy=0;"},"GB^1_{n,1}":{"KEYS_1":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.45;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","LEV_{n,1}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;", "KEYS_2":"exitX=1;exitY=0.75;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"LEV_{n,1}":{"KEYS_1":"exitX=0.6;exitY=0.45;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_2":"exitX=0.75;exitY=0.65;entryX=0.1;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"GB^1_{n,2}":{"KEYS_2":"exitX=1;exitY=0.25;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","LEV_{n,2}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_3":"exitX=0.85;exitY=0.65;entryX=0.05;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"LEV_{n,2}":{"KEYS_2":"exitX=0.85;exitY=0.25;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_3":"exitX=0.8;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"GB^1_{n,d}":{"KEYS_d":"exitX=0.75;exitY=0.35;entryX=0;entryY=0.4;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","LEV_{n,d}":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","KEYS_{d+1}":"exitX=0.75;exitY=0.65;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"LEV_{n,d}":{"KEYS_d":"exitX=0.85;exitY=0.3;entryX=0.05;entryY=0.7;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","KEYS_{d+1}":"exitX=0.9;exitY=0.75;entryX=0.05;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[],"GB^1_{n,1}":[{"x":280,"y":50}],"LEV_{n,1}":[],"GB^1_{n,2}":[{"x":280,"y":150}],"LEV_{n,2}":[],"GB^1_{n,d}":[{"x":290,"y":300}],"LEV_{n,d}":[]}},

	    "ghost":
	    {
		"KEYS_3": {"x":250, "y":165, "style":"exitX=0;exitY=0;entryX=0;entryY=0.9;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},
		"KEYS_d": {"x": 250, "y":227, "style":"exitX=0.999;exitY=0.05;entryX=0.111;entryY=0.222;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}
	    },

	    "decoration":
	    {
		"vellipses": [{"x":180, "y":180}, {"x":520, "y":180}]
	    }


	}

    };


    var prooftree = {
	"Theorem(Monolithic)":
	{
	    "parent": null,
	    "contents": [
		{
		    "text": "The following games are indistinguishable assuming IND-CPA secure schemes exist."
		},
		{
		    "graphs": [["PRVSIM^0(GB, DINF)"], ["PRVSIM^1(SIM)"]]
		}
	    ]
	},

	"Theorem 1":
	{
	    "parent": "Theorem(Monolithic)",
	    "contents": [
		{
		    "graphs": []
		}
	    ]
	},

	"Claim 3":
	{
	    "parent": "Theorem(Monolithic)",
	    "contents": [
		{
		    "graphs": [["PRVSIM^0(GB, DINF)", "MOD^0->SEC^0_{n,d}(GB_{yao,n,d})"]]
		}
	    ]
	},

	"Claim 4":
	{
	    "parent": "Theorem(Monolithic)",
	    "contents": [
		{
		    "graphs": [["PRVSIM^1(SIM)", "MOD_{n,d}->SEC^1_{n,d}(SIM_{yao,n,d})"]]
		}
	    ]
	},

	"Lemma 4":
	{
	    "parent": "Theorem 1",
	    "contents": [
		{
		    "graphs": []
		}
	    ]
	},

	"Lemma 5":
	{
	    "parent": "Theorem 1",
	    "contents": [
		{
		    "graphs": []
		}
	    ]
	},

	"Eq 5":
	{
	    "parent": "Lemma 5",
	    "contents": [
		{
		    "graphs": [["SEC^0_{n,d}(GB_{yao,n,d})", "SEC^0_{n,d}(GB_{yao,n,d})"]]
		},
	    ],
	    "type":
	    {
		"reduction":
		[
		    {
			"i": 0, "j": 1,
			"cut": ["GB^0_{n,2}", "GB^0_{n,d}", "KEYS_3", "KEYS_d", "KEYS_{d+1}"]
		    }
		]
	    }

	},

	"Eq 6":
	{
	    "parent": "Lemma 5",
	    "contents": [
		{
		    "graphs": [["SEC^1_{n,d}(SIM_{yao,n,d})", "SEC^1_{n,d}(SIM_{yao,n,d})"]]
		}
	    ],
	    "type":
	    {
		"reduction":
		[
		    {
			"name": "hamster-reduction",
			"i": 0, "j": 1,
			"cut": ["GB^1_{n,1}", "GB^1_{n,2}", "LEV_{n,1}", "LEV_{n,2}", "KEYS_1", "KEYS_2", "KEYS_3"]
		    }
		]
	    }

	},

	"Eq 7":
	{
	    "parent": "Lemma 5",
	    "contents": [
		{
		    "graphs": [["H_i", "H_i"]]
		}
	    ],
	    "type":
	    {
		"reduction":
		[
		    {
			"name": "H_i",
			"i": 0, "j": 0,
			"cut": ["GB^1_1", "LEV_{n,1}", "KEYS_1", "KEYS_2", "GB^1_{i-1}", "LEV_{n,i-1}", "KEYS_{i-1}", "KEYS_{i+2}", "GB^0_{n,i+1}", "KEYS_{i+3}", "GB^0_{n,i+2}", "KEYS_d", "KEYS_{d+1}", "GB^0_{n,d}"]
		    },

		    {
			"name": "H_i",
			"i": 0, "j": 1,
			"cut": ["GB^1_1", "LEV_{n,1}", "KEYS_1", "KEYS_2", "GB^1_{i-1}", "LEV_{n,i-1}", "KEYS_{i-1}", "KEYS_i", "GB^1_i", "LEV_{n,i}", "KEYS_{i+3}", "GB^0_{n,i+2}", "KEYS_d", "KEYS_{d+1}", "GB^0_{n,d}"]
		    }

		]
	    }

	},

	"Claim 1":
	{
	    "parent": "Lemma 4",
	    	    "contents": [
		{
		    "graphs": [["LSEC^0_{n,i}(GB^0_{yao,n,i})"], ["LSEC^0_{n,i}(GB^0_{yao,n,i})"]]
		}
	    ],
	    "type":
	    {
		"reduction":
		[
		    {
			"name": "LSEC^0_{n,i}(GB^0_{yao,n,i})",
			"i": 0, "j": 0,
		    },
		    {
			"name": "\\mathcal{R}^{i}_{layer} \\rightarrow 2CPA^0",
			"i": 1, "j": 0,
			"cut": ["MODGB_{n,i}", "GATE_n", "KEYS_{i+1}"]
		    }
		]
	    }
	},

	"Claim 2":
	{
	    "parent": "Lemma 4",
	    "contents": [
		{
		    "graphs": [["HYB_{n,i}"], ["LSEC^1_{n,i}(GB^1_{yao,n,i})"]]
		}
	    ],
	    "type":
	    {
		"reduction":
		[
		    {
			"name": "\\mathcal{R}^{i}_{layer} \\rightarrow 2CPA^1",
			"i": 0, "j": 0,
			"cut": ["MODGB_{n,i}", "GATE_n", "KEYS_{i+1}"]
		    },
		    {
			"i": 1, "j": 0,
			"cut": ["MODGB_{n,i}", "SIM_{gate,n}"]
		    },
		]
	    }
	},

	"Eq 2":
	{
	    "parent": "Claim 2",
	    "contents": [
		{
		    "graphs": [["HYB_{n,i}"], ["LSEC^1_{n,i}(GB^1_{yao,n,i})"]]
		}
	    ],
	    "type":
	    {
		"reduction":
		[
		    {
			"i": 0, "j": 0,
			"cut": ["GATE_n", "KEYS_i", "ENC^1_{1,n}", "KEYS_{i+1}"]
		    },
		    {
			"i": 1, "j": 0,
			"cut": ["SIM_{gate,n}", "KEYS_i", "LEV_{n,i}", "KEYS_{i+1}"]
		    }
		]
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
    var wrapper_width = {proof_width: '70%', oracle_width: '28%'}
    add_proof(proof, wnd_pos, wrapper_width);


}

newyao_driver();
