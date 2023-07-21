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

	"IND-CPA^b":
	{
	    "oracles":
	    {
		"SMP":
		{
		    "code": "@assert k = \\bot;k @sample \\{0,1\\}^{\\lambda};@return ()",
		    "params": []
		},

		"ENC":
		{
		    "code": "@assert k \\neq \\bot;@assert |m_0| = |m_1|; c @sample enc(k, m_b);@return c",
		    "params": ["m_0", "m_1"]
		}
	    }
	},

	"RED":
	{
	    "oracles":
	    {
		"SETBIT":
		{
		    "code": "@assert z = \\bot;z @gets z';@return ()",
		    "params": ["z'"]
		},

		"GETA^{out}":
		{
		    "code": "@assert z \\neq \\bot;\\mathsf{flag} @gets 1;@if Z = \\bot @then;@> Z(z) @sample \\{0,1\\}^{\\lambda};@> \\mathsf{SMP}();@return Z(z)",
		    "params": []
		},

		"ENC":
		{
		    "code": "@assert \\mathsf{flag} = 1;@assert |m_0| = |m_1|; c @sample enc(Z(z), m_0);@if z \\neq d @then;@> c @gets \\mathsf{ENC}(m_0, m_1);@return c",
		    "params": ["d", "m_0", "m_1"]
		}
	    }
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
	},

	"MOD_{n,d}":
	{
	    "oracles":
	    {
		"GARBLE":
		{
		    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{SETBIT}_j(x_j);@> \\tilde{x}[j] @gets \\mathsf{GETA}^{out}_j;@for i = 1..d @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];@> \\tilde{C}[i] @gets \\mathsf{GBL}_i(\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op});@for j = 1..n @do;@> \\text{dinf}[j] @gets \\mathsf{GETKEYS}^{in}_j;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
		    "params": ["C", "x"]
		}
	    }
	},

	"MOD":
	{
	    "instance": "MOD_{n,d}"
	},

	"MOD-PRIVSIM^b_{n,d}":
	{
	    "oracles":
	    {
		"GARBLE":
		{
		    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{SETBIT}_j(x_j);@if b = 1 @then \\mathsf{EVAL(C)};\\tilde{C} @gets \\mathsf{GBL}(C);\\text{dinf} @gets \\mathsf{GETDINF};@for j = 1..n @do;@> \\tilde{x}[j] @gets \\mathsf{GETA}^{out}_j;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
		    "params": ["C", "x"]
		}
	    }
	},

	"MOD-PRIVSIM^0":
	{
	    "instance": "MOD-PRIVSIM^b_{n,d}"
	},

	"MOD-PRIVSIM^1":
	{
	    "instance": "MOD-PRIVSIM^b_{n,d}"
	},

	"EV_{n,d}":
	{
	    "oracles":
	    {
		"EVAL" :
		{
		    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{GETBIT}_j;@for i = 1..d @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];      @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j)); @> @> z_{i,j} @gets op(z_{i-1,\\ell},z_{i-1,r});@for j = 1..d @do;@> \\mathsf{SETBIT}_j(z_{d,j});@return ()",
		    "params": ["j", "\\ell", "r", "op"]
		}

	    }

	},

	"EV":
	{
	    "instance": "EV_{n,d}"
	},

	"BITS":
	{
	    "oracles":
	    {
		"SETBIT_j":
		{
		    "code": "@assert z_j = \\bot;z_j @gets z;@return ()",
		    "params": ["z"]
		},

		"GETBIT":
		{
		    "code": "@assert z_j \\neq \\bot;@return z_j",
		    "params": []
		}
	    }
	},

	"BITS_1":
	{
	    "instance": "BITS"
	},

	"BITS_n":
	{
	    "instance": "BITS"
	},

	"EKEYS_j":
	{
	    "oracles":
	    {
		"SETKEYS_j":
		{
		    "code": "@assert Z_j = \\bot;Z_j @gets Z;@return ()",
		    "params": ["Z"]
		},

		"GETKEYS_j":
		{
		    "code": "@assert Z_j \\neq \\bot;@return Z_j",
		    "params": []
		}
	    }

	},

	"EKEYS_{1,...,n}":
	{
	    "instance": "EKEYS_j"
	},


	"EN_j":
	{
	    "oracles":
	    {
		"SETBIT_j":
		{
		    "code": "@assert z_j = \\bot;z_j @gets z;@return ()",
		    "params": ["z"]
		},

		"GETA":
		{
		    "code": "@assert z_j \\neq \\bot;Z @gets \\mathsf{GETKEYS}^{in}_j;@return Z(z_j)",
		    "params": []
		}
	    }

	},

	"EN":
	{
	    "instance": "EN_j"
	},

	"GB_{tdyao,n,d}":
	{
	    "oracles":
	    {
		"GBL":
		{
		    "code": "@for i = 0..d @do;@> @for j = 1..n @do;@> @> Z_{i,j}(0) @sample \\{0,1\\}^{\\lambda};@> @> Z_{i,j}(1) @sample \\{0,1\\}^{\\lambda};@for i = 1..d @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];      @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{g}_j @gets \\bot;@> @> @for (b_{\\ell},b_r) \\in \\{0,1\\}^2;@> @> @> b_j @gets op(b_{\\ell}, b_r);@> @> @> k_j @gets Z_{i,j}(b_j);@> @> @> c_{in} @sample enc(Z_{i,\\ell}(b_{\\ell}, k_j));@> @> @> c @sample enc(Z_{i,r}(b_r), c_{in});@> @> @> \\tilde{g}_j @gets \\tilde{g}_j \\cup c; @> @> \\tilde{C}[i,j] @gets \\tilde{g}_j;@for j = 1..n @do;@> \\mathsf{SETKEYS}_j(Z_{0,j});\\mathsf{SETDINF}(Z_{d,1}, \\cdots, Z_{d,n});@return \\tilde{C}",
		    "params": ["C"]
		}
	    }
	},

	"GB":
	{
	    "instance": "GB_{tdyao,n,d}"
	},

	"SIM_{tdyao}":
	{
	    "oracles":
	    {
		"GBL":
		{
		    "code": "@for i = 0..d @do;@> @for j = 1..n @do;@> @> S_{i,j}(0) @sample \\{0,1\\}^{\\lambda};@> @> S_{i,j}(1) @sample \\{0,1\\}^{\\lambda};@for i = 1..d @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];      @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{g}_j @gets \\bot;@> @> @for (d_{\\ell},d_r) \\in \\{0,1\\}^2;@> @> @> k_{i-1,\\ell} @gets S_{i-1,\\ell}(d_{\\ell});@> @> @> k_{i-1,r} @gets S_{i-1,r}(d_{r});@> @> @> @if d_{\\ell} = d_r = 0:;@> @> @> @> k_{i,j} @gets S_{i,j}(0);@> @> @> @else k_{i,j} @gets 0^{\\lambda};@> @> @> c_{in} @sample enc(k_{i-1,r}, k_{i,j}));@> @> @> c @sample enc(k_{i-1,\\ell}, c_{in});@> @> @> \\tilde{g}_j @gets \\tilde{g}_j \\cup c; @> @> \\tilde{C}_j @gets \\tilde{g}_j;\\tilde{C}[i] @gets \\tilde{C}_{1,..n};@return \\tilde{C}",
		    "params": ["C"]
		},

		"GETDINF":
		{
		    "code": "@for j = 1..n @do;@> z_{d,j} @gets \\mathsf{GETBIT}_j;@> Z_{d,j}(z_{d,j}) @gets S_{d,j}(0);@> Z_{d,j}(1-z_{d,j}) @gets S_{d,j}(1);@> \\text{dinf}[j] @gets Z_{d,j};@return \\text{dinf}",
		    "params": []
		},

		"GETA_j":
		{
		    "code": "@return S_{0,j}(0)",
		    "params": []
		}

	    }
	},

	"SIM":
	{
	    "instance": "SIM_{tdyao}"
	},

	"DINF_{tdyao}":
	{
	    "oracles":
	    {
		"SETDINF":
		{
		    "code": "\\text{dinf} @gets \\text{dinf};@return ()",
		    "params": ["\\text{dinf}"]
		},
		"GETDINF":
		{
		    "code": "@return \\text{dinf}",
		    "params": []
		}
	    }
	},

	"DINF":
	{
	    "instance": "DINF_{tdyao}"
	}




    };


    var modular_pkgs = {
	"2CPA":
	{
	    "oracles": [["KEYS", "SETBIT|GETA^{out}"], ["ENC^b", "ENC"]],
	    "graph":
	    {
		"ENC^b": [["KEYS", "GETBIT|GETKEYS^{in}"]],
		"KEYS": []
	    },
	    "layout": {"nodes":{"@oracles_interface":{"x":10,"y":0,"width":10,"height":80},"ENC^b":{"x":90,"y":30,"width":90,"height":50},"KEYS":{"x":300,"y":0,"width":90,"height":50}},"edges":{"@oracles_interface":{"KEYS":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","ENC^b":"exitX=0.65;exitY=0.55;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"ENC^b":{"KEYS":"exitX=0.85;exitY=0.3;entryX=0.05;entryY=0.7;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[],"ENC^b":[]}}
	},

	"RED->IND-CPA^b(se)":
	{
	    "oracles": [["RED", "SETBIT|GETA^{out}|ENC"]],
	    "graph":
	    {
		"RED": [["IND-CPA^b", "SMP|ENC"]],
		"IND-CPA^b": []
	    },
	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":50},"RED":{"x":80,"y":0,"width":90,"height":50},"IND-CPA^b":{"x":250,"y":0,"width":90,"height":50}},"edges":{"@oracles_interface":{"RED":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"RED":{"IND-CPA^b":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[],"RED":[]}}
	},

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

	"MOD \\rightarrow SEC^0_{n,d}(GB_{yao,n,d})":
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
		    "text": "(Security of Yao’s garbling scheme).<br> Let \\(se\\) be the symmetric encryption scheme used within \\(\\mathsf{gs}_{tdyao}\\) . Then for all \\(n, d \\in \\mathbb{N}\\), there exists a PPT simulator \\(\\mathsf{SIM}_{tdyao,n,d}\\) and reduction \\(\\mathcal{R}\\) such for all PPT adversaries \\(\\mathcal{A}\\), $$\\mathsf{Adv}(\\mathcal{A}; \\mathsf{PRVSIM}^0_{n,d}(\\mathsf{GB}_{tdyao,n,d}, \\mathsf{DINF}_{tdyao}), \\mathsf{PRVSIM}^1_{n,d}(\\mathsf{SIM}_{tdyao,n,d})) \\leq dn \\cdot \\mathsf{Adv}(\\mathcal{A} \\rightarrow \\mathcal{R}; \\mathsf{IND\\text{-}CPA}^0(se), \\mathsf{IND\\text{-}CPA}^1(se)).$$"
		},
		{
		    "graphs": [["PRVSIM^0(GB, DINF)"], ["PRVSIM^1(SIM)"]]
		},
		{
		    "text": "Putting together "
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
		    "text": "(Real game equivalence)<br>For all \\(n,d \\in \\mathbb{N},\\) $$\\mathsf{PRVSIM}^0_{n,d}(\\mathsf{GB}_{tdyao,n,d}, \\mathsf{DINF}_{tdyao}) \\stackrel{\\text{code}}{\\equiv} \\mathsf{MOD}_{n,d} \\rightarrow \\mathsf{SEC}^0_{n,d}(\\mathsf{GB}_{yao,n,d}).$$"
		},
		{
		    "graphs": [["PRVSIM^0(GB, DINF)", "MOD \\rightarrow SEC^0_{n,d}(GB_{yao,n,d})"]]
		}
	    ],
	    "type":
	    {
		"codeq":
		{
		    "columns":
		    [
			{
			    "packages":
			    {
				"G^1_{real}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{SETBIT}_j(x_j);;\\tilde{C} @gets \\mathsf{GBL}(C);;;;;;;;;;;;;;;;;;;\\text{dinf} @gets \\mathsf{GETDINF};@for j = 1..n @do;@> \\tilde{x}[j] @gets \\mathsf{GETA}^{out}_j;;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^2_{real}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{SETBIT}_j(x_j);;@for i = 0..d @do;@> @for j = 1..n @do;@> @> Z_{i,j}(0) @sample \\{0,1\\}^{\\lambda};@> @> Z_{i,j}(1) @sample \\{0,1\\}^{\\lambda};@for i = 1..d @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];      @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{g}_j @gets \\bot;@> @> @for (b_{\\ell},b_r) \\in \\{0,1\\}^2;@> @> @> b_j @gets op(b_{\\ell}, b_r);@> @> @> k_j @gets Z_{i,j}(b_j);@> @> @> c_{in} @sample enc(Z_{i,\\ell}(b_{\\ell}, k_j));@> @> @> c @sample enc(Z_{i,r}(b_r), c_{in});@> @> @> \\tilde{g}_j @gets \\tilde{g}_j \\cup c; @> @> \\tilde{C}[i,j] @gets \\tilde{g}_j;@for j = 1..n @do;@> \\mathsf{SETKEYS}_j(Z_{0,j});\\mathsf{SETDINF}(Z_{d,1}, \\cdots, Z_{d,n});\\text{dinf} @gets \\mathsf{GETDINF};@for j = 1..n @do;@> \\tilde{x}[j] @gets \\mathsf{GETA}^{out}_j;;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^3_{real}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> @assert z_j = \\bot;@> z_j @gets x_j;@for i = 0..d @do;@> @for j = 1..n @do;@> @> Z_{i,j}(0) @sample \\{0,1\\}^{\\lambda};@> @> Z_{i,j}(1) @sample \\{0,1\\}^{\\lambda};@for i = 1..d @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];      @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{g}_j @gets \\bot;@> @> @for (b_{\\ell},b_r) \\in \\{0,1\\}^2;@> @> @> b_j @gets op(b_{\\ell}, b_r);@> @> @> k_j @gets Z_{i,j}(b_j);@> @> @> c_{in} @sample enc(Z_{i,\\ell}(b_{\\ell}, k_j));@> @> @> c @sample enc(Z_{i,r}(b_r), c_{in});@> @> @> \\tilde{g}_j @gets \\tilde{g}_j \\cup c; @> @> \\tilde{C}[i,j] @gets \\tilde{g}_j;@for j = 1..n @do;@> \\mathsf{SETKEYS}_j(Z_{0,j});\\mathsf{SETDINF}(Z_{d,1}, \\cdots, Z_{d,n});\\text{dinf} @gets (Z_{d,1}, ...., Z_{d,n});@for j = 1..n @do;@> z_j \\neq \\bot;\\tilde{x}[j] @gets Z_{0,j}(z_j);@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^4_{real}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> @assert z_{0,j} = \\bot;@> z_{0,j} @gets x_j;@> Z_{0,j}(0) @sample \\{0,1\\}^{\\lambda};@> Z_{0,j}(1) @sample \\{0,1\\}^{\\lambda};@> \\tilde{x}[j] @gets Z_{0,j}(z_{0,j});;@for i = 1..d @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];;@> @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{C}_j @gets \\bot;@> @> Z_{i,j}(0) @sample \\{0,1\\}^{\\lambda};@> @> Z_{i,j}(1) @sample \\{0,1\\}^{\\lambda};@> @> @for (b_{\\ell},b_r) \\in \\{0,1\\}^2;@> @> @> b_j @gets op(b_{\\ell}, b_r);@> @> @> k^0_j @gets Z_{i,j}(b_j);@> @> @> c^0_{in} @sample enc(Z_{i-1,\\ell}(b_{\\ell}, k^0_j));@> @> @> c^1_{in} @sample enc(Z_{i-1,\\ell}(b_{\\ell}), 0^{\\lambda});@> @> @> c @sample enc(Z_{i-1,r}(b_r), c^0_{in});;@> @> @> \\tilde{C}_j @gets \\tilde{C}_j \\cup c;@> \\tilde{C}[i] @gets \\tilde{C}_{1..n};@for j = 1..n @do;@> \\text{dinf}[j] @gets Z_{d,j};@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^5_{real}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{SETBIT}_j(x_j);;@> \\tilde{x}[j] @gets \\mathsf{GETA}^{out}_j;;;;@for i = 1..d @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];;@> @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> @assert \\tilde{C}[i] = \\bot;@> @> @for j = 1..n @do;@> @> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j)); @> @> @> \\tilde{C}_j @gets \\mathsf{GBLG}(\\ell, r, op, j);;;;;;;;@> \\tilde{C}[i] @gets \\tilde{C}_{1..n};@for j = 1..n @do;@> \\text{dinf}[j] @gets \\mathsf{GETKEYS}^{in}_j;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^6_{real}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{SETBIT}_j(x_j);;@> \\tilde{x}[j] @gets \\mathsf{GETA}^{out}_j;;;;@for i = 1..d @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];@> \\tilde{C}[i] @gets \\mathsf{GBL}_i(\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op});;;;;;;;;;;;;;;@for j = 1..n @do;@> \\text{dinf}[j] @gets \\mathsf{GETKEYS}^{in}_j;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			}
		    ]
		},

		"cuts": [

		]
	    }
	},

	"Claim 4":
	{
	    "parent": "Theorem(Monolithic)",
	    "contents": [
		{
		    "text": "(Ideal game equivalence)<br>For all \\(n,d \\in \\mathbb{N},\\) $$\\mathsf{PRVSIM}^1_{n,d}(\\mathsf{SIM}_{tdyao,n,d}) \\stackrel{\\text{code}}{\\equiv} \\mathsf{MOD}_{n,d} \\rightarrow \\mathsf{SEC}^1_{n,d}(\\mathsf{SIM}_{yao,n,d}).$$",
		},
		{
		    "graphs": [["PRVSIM^1(SIM)", "MOD_{n,d}->SEC^1_{n,d}(SIM_{yao,n,d})"]]
		}
	    ],
	    "type":
	    {
		"codeq":
		{
		    "columns":
		    [
			{
			    "packages":
			    {
				"G^1_{ideal}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{SETBIT}_j(x_j);;\\mathsf{EVAL}_j(C);;;;\\tilde{C} @gets \\mathsf{GBL}(C);;;;;;;;;;;;;;;;;;;;;;;\\text{dinf} @gets \\mathsf{GETDINF};;;;;@for j = 1..n @do;@> \\text{dinf}[j] @gets \\mathsf{GETKEYS}^{in}_j;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^2_{ideal}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> @assert z_{0,j} = \\bot;@> z_{0,j} @gets x_j;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for i = 1..d  @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];@> @for j = 1..n @do;@> @> z_{i,j} @gets op(z_{i-1,\\ell}, z_{i-1,r});@for i = 1..d @do;@> @for j = 1..n do;@> @> @> S_{i,j}(0) @sample \\{0,1\\}^{\\lambda};@> @> @> S_{i,j}(1) @sample \\{0,1\\}^{\\lambda};@for i = 1..d @do;@> (\\boldsymbol{\\ell}, \\boldsymbol{r}, \\boldsymbol{op}) @gets C[i];@> @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{g}_j @gets \\bot;;;@> @> @for (d_{\\ell},d_r) \\in \\{0,1\\}^2;@> @> @> k_{i-1,\\ell} @gets S_{i-1,\\ell}(d_{\\ell});@> @> @> k_{i-1,r} @gets S_{i-1,r}(d_{r});@> @> @> @if d_{\\ell} = d_r = 0:;@> @> @> @> k_{i,j} @gets S_{i,j}(0);@> @> @> @else k_{i,j} @gets 0^{\\lambda};@> @> @> c_{in} @sample enc(k_{i-1,r}, k_{i,j}));@> @> @> c @sample enc(k_{i-1,\\ell}, c_{in});@> @> @> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@> @> \\tilde{C}_j @gets \\tilde{g}_j;@> \\tilde{C}[i] @gets \\tilde{C}_{1..n};@for j = 1..n @do;@> Z_{d,j}(z_{d,j}) @gets S_{d,j}(0);@> Z_{d,j}(1-z_{d,j}) @gets S_{d,j}(1);@> \\text{dinf}[j] @gets Z_{d,j};@for j = 1..n @do;@> \\tilde{x}[j] @gets S_{0,j}(0);@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^3_{ideal}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> @assert z_{0,j} = \\bot;@> z_{0,j} @gets x_j;;;@for i = 1..d  @do;@> (\\boldsymbol{\\ell},\\boldsymbol{r},\\boldsymbol{op}) @gets C[i];@> @for j = 1..n @do;@> @> z_{i,j} @gets op(z_{i-1,\\ell}, z_{i-1,r});;@for j = 1..n do;@> @> S_{i,j}(0) @sample \\{0,1\\}^{\\lambda};@> @> S_{i,j}(1) @sample \\{0,1\\}^{\\lambda};@for i = 1..d @do;@> (\\boldsymbol{\\ell}, \\boldsymbol{r}, \\boldsymbol{op}) @gets C[i];@> @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{g}_j @gets \\bot;@> @> S_{i,j}(0) @sample \\{0,1\\}^{\\lambda};@> @> S_{i,j}(1) @sample \\{0,1\\}^{\\lambda};@> @> @for (d_{\\ell},d_r) \\in \\{0,1\\}^2;@> @> @> k_{i-1,\\ell} @gets S_{i-1,\\ell}(d_{\\ell});@> @> @> k_{i-1,r} @gets S_{i-1,r}(d_{r});@> @> @> @if d_{\\ell} = d_r = 0:;@> @> @> @> k_{i,j} @gets S_{i,j}(0);@> @> @> @else k_{i,j} @gets 0^{\\lambda};@> @> @> c_{in} @sample enc(k_{i-1,r}, k_{i,j}));@> @> @> c @sample enc(k_{i-1,\\ell}, c_{in});@> @> @> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@> @> \\tilde{C}_j @gets \\tilde{g}_j;@> \\tilde{C}[i] @gets \\tilde{C}_{1..n};@for j = 1..n @do;@> Z_{d,j}(z_{d,j}) @gets S_{d,j}(0);@> Z_{d,j}(1-z_{d,j}) @gets S_{d,j}(1);@> \\text{dinf}[j] @gets Z_{d,j};;;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^4_{ideal}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> @assert z_{0,j} = \\bot;@> z_{0,j} @gets x_j;@> \\mathsf{flag}_{0,j} @gets 1;@> S_{0,j} @sample \\{0,1\\}^{\\lambda};@> S_{0,j}(1) @sample \\{0,1\\}^{\\lambda};@> \\tilde{x}[j] @gets S_{0,j}(0);@for i = 1..d @do;@> (\\boldsymbol{\\ell}, \\boldsymbol{r}, \\boldsymbol{op}) @gets C[i];;;@> @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{g}_j @gets \\bot;;;@> @> z_{i,j} @gets op(z_{i-1,\\ell},z_{i-1,r});;@> @> S_{i,j}(0) @sample \\{0,1\\}^{\\lambda};@> @> S_{i,j}(1) @sample \\{0,1\\}^{\\lambda};;;;;;@> @> @for (d_{\\ell},d_r) \\in \\{0,1\\}^2;@> @> @> k_{i-1,\\ell} @gets S_{i-1,\\ell}(d_{\\ell});@> @> @> k_{i-1,r} @gets S_{i-1,r}(d_{r});@> @> @> @if d_{\\ell} = d_r = 0:;@> @> @> @> k_{i,j} @gets S_{i,j}(0);@> @> @> @else k_{i,j} @gets 0^{\\lambda};@> @> @> c_{in} @sample enc(k_{i-1,r}, k_{i,j}));@> @> @> c @sample enc(k_{i-1,\\ell}, c_{in});@> @> @> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@> @> \\tilde{C}_j @gets \\tilde{g}_j;@> \\tilde{C}[i] @gets \\tilde{C}_{1..n};@for j = 1..n @do;@> Z_{d,j}(z_{d,j}) @gets S_{d,j}(0);@> Z_{d,j}(1-z_{d,j}) @gets S_{d,j}(1);@> \\text{dinf}[j] @gets Z_{d,j};@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^5_{ideal}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> @assert z_{0,j} = \\bot;@> z_{0,j} @gets x_j;@> \\mathsf{flag}_{0,j} @gets 1;@> Z_{0,j} @sample \\{0,1\\}^{\\lambda};@> Z_{0,j}(1) @sample \\{0,1\\}^{\\lambda};@> \\tilde{x}[j] @gets Z(z_{0,j});@for i = 1..d @do;@> (\\boldsymbol{\\ell}, \\boldsymbol{r}, \\boldsymbol{op}) @gets C[i];;;@> @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{g}_j @gets \\bot;;;@> @> z_{i,j} @gets op(z_{i-1,\\ell},z_{i-1,r});;@> @> Z_{i,j}(0) @sample \\{0,1\\}^{\\lambda};@> @> Z_{i,j}(1) @sample \\{0,1\\}^{\\lambda};@> @> S_{i,j}(0) @gets Z_{i,j}(z_{i,j});@> @> S_{i-1,r}(0) @gets Z_{i-1,r}(z_{i-1,r});@> @> S_{i-1,r} @gets Z_{i-1,r}(1  - z_{i-1,r});@> @> S_{i-1,\\ell}(0) @gets Z_{i-1,r}(z_{i-1,\\ell});@> @> S_{i-1,\\ell} @gets Z_{i-1,r}(1- z_{i-1,\\ell});@> @> @for (d_{\\ell},d_r) \\in \\{0,1\\}^2;@> @> @> k_{i-1,\\ell} @gets S_{i-1,\\ell}(d_{\\ell});@> @> @> k_{i-1,r} @gets S_{i-1,r}(d_{r});@> @> @> @if d_{\\ell} = d_r = 0:;@> @> @> @> k_{i,j} @gets S_{i,j}(0);@> @> @> @else k_{i,j} @gets 0^{\\lambda};@> @> @> c_{in} @sample enc(k_{i-1,r}, k_{i,j}));@> @> @> c @sample enc(k_{i-1,\\ell}, c_{in});@> @> @> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@> @> \\tilde{C}_j @gets \\tilde{g}_j;@> \\tilde{C}[i] @gets \\tilde{C}_{1..n};@for j = 1..n @do;@> \\text{dinf}[j] @gets Z_{d,j};;;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^6_{ideal}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{SETBIT}_{0,j}(x_j);;@> \\tilde{x}[j] @gets \\mathsf{GETA}^{out}_{0,j};;;;@for i = 1..d @do;@> (\\boldsymbol{\\ell}, \\boldsymbol{r}, \\boldsymbol{op}) @gets C[i];;;@> @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{g}_j @gets \\bot;@> @> z_{i-1,\\ell} @gets \\mathsf{GETBIT}_{i-1,\\ell};@> @> z_{i-1,r} @gets \\mathsf{GETBIT}_{i-1,r};@> @> z_{i,j} @gets op(z_{i-1,\\ell},z_{i-1,r});@> @> \\mathsf{SETBIT}_{i,j}(z_{i,j});@> @> S_{i,j}(0) @sample \\mathsf{GETA}^{out}_{i,j};;;@> @> S_{i-1,r}(0) @gets \\mathsf{GETA}^{in}_{i-1,r};@> @> S_{i-1,r} @gets \\mathsf{GETINA}^{in}_{i-1,r};@> @> S_{i-1,\\ell}(0) @gets \\mathsf{GETA}^{in}_{i-1,\\ell};@> @> S_{i-1,\\ell} @gets \\mathsf{GETINA}^{in}_{i-1,\\ell};@> @> @for (d_{\\ell},d_r) \\in \\{0,1\\}^2;@> @> @> k_{i-1,\\ell} @gets S_{i-1,\\ell}(d_{\\ell});@> @> @> k_{i-1,r} @gets S_{i-1,r}(d_{r});@> @> @> @if d_{\\ell} = d_r = 0:;@> @> @> @> k^{out}_{i,j} @gets S_{i,j}(0);@> @> @> @else k^{out}_{i,j} @gets 0^{\\lambda};@> @> @> c_{in} @sample enc(k_{i-1,r}, k_{i,j}));@> @> @> c @sample enc(k_{i-1,\\ell}, c_{in});@> @> @> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@> @> \\tilde{C}_j @gets \\tilde{g}_j;@> \\tilde{C}[i] @gets \\tilde{C}_{1..n};@for j = 1..n @do;@> \\text{dinf}[j] @gets \\mathsf{GETKEYS}^{in}_{d,j};;;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^7_{ideal}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{SETBIT}_{0,j}(x_j);;@> \\tilde{x}[j] @gets \\mathsf{GETA}^{out}_{0,j};;;;@for i = 1..d @do;@> (\\boldsymbol{\\ell}, \\boldsymbol{r}, \\boldsymbol{op}) @gets C[i];@> @assert \\tilde{C}[i] = \\bot;@> @assert |\\boldsymbol{\\ell}|, |\\boldsymbol{r}|, |\\boldsymbol{op}| = n;@> @for j = 1..n @do;@> @> (\\ell, r, op) @gets (\\boldsymbol{\\ell}(j),\\boldsymbol{r}(j),\\boldsymbol{op}(j));@> @> \\tilde{g}_j @gets \\bot;@> @> \\mathsf{EVAL}_{i,j}(\\ell,r,op);;;@> @> \\mathsf{SETBIT}_{i,j}(z_{i,j});@> @> S_{i,j}(0) @sample \\mathsf{GETA}^{out}_{i,j};;;@> @> S_{i-1,r}(0) @gets \\mathsf{GETA}^{in}_{i-1,r};@> @> S_{i-1,r} @gets \\mathsf{GETINA}^{in}_{i-1,r};@> @> S_{i-1,\\ell}(0) @gets \\mathsf{GETA}^{in}_{i-1,\\ell};@> @> S_{i-1,\\ell} @gets \\mathsf{GETINA}^{in}_{i-1,\\ell};@> @> @for (d_{\\ell},d_r) \\in \\{0,1\\}^2;@> @> @> k_{i-1,\\ell} @gets S^{in}_{i-1,\\ell}(d_{\\ell});@> @> @> k_{i-1,r} @gets S^{in}_{i-1,r}(d_{r});@> @> @> @if d_{\\ell} = d_r = 0:;@> @> @> @> k_{i,j} @gets S^{out}_{i,j}(0);@> @> @> @else k_{i,j} @gets 0^{\\lambda};@> @> @> c_{in} @sample enc(k_{i-1,r}, k_{i,j}));@> @> @> c @sample enc(k_{i-1,\\ell}, c_{in});@> @> @> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@> @> \\tilde{C}_j @gets \\tilde{g}_j;@> \\tilde{C}[i] @gets \\tilde{C}_{1..n};@for j = 1..n @do;@> \\text{dinf}[j] @gets \\mathsf{GETKEYS}^{in}_{d,j};;;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"G^8_{ideal}":
				{
				    "oracles":
				    {
					"GARBLE":
					{
					    "code": "@assert \\tilde{C} = \\bot;@assert \\mathsf{width}(C) = n;@assert \\mathsf{depth}(C) = d;@for j = 1..n @do;@> \\mathsf{SETBIT}_{0,j}(x_j);;@> \\tilde{x}[j] @gets \\mathsf{GETA}^{out}_{0,j};;;;@for i = 1..d @do;@> (\\boldsymbol{\\ell}, \\boldsymbol{r}, \\boldsymbol{op}) @gets C[i];@> \\tilde{C}[i] @gets \\mathsf{GBL}_i(\\boldsymbol{\\ell}, \\boldsymbol{r}, \\boldsymbol{op});;;;;;;;;;;;;;;;;;;;;;;;;;;@for j = 1..n @do;@> \\text{dinf}[j] @gets \\mathsf{GETKEYS}^{in}_{d,j};;;@return (\\tilde{C}, \\tilde{x}, \\text{dinf})",
					    "params": ["C", "x"]
					}
				    }
				}
			    }
			}
		    ]
		},

		"cuts": [

		]
	    }
	},

	"Lemma 2": {
	    "parent": "Theorem(Monolithic)",
	    "contents": [
		{
		    "graphs": [["2CPA", "RED->IND-CPA^b(se)"]]
		}
	    ],
	    "type":
	    {
		"codeq":
		{
		    "columns":
		    [
			{
			    "packages":
			    {
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

				"KEYS":
				{
				    "oracles":
				    {
					"SETBIT" :
					{
					    "code": "@assert z = @bot;z @gets z';@return ();",
					    "params": ["z'"]
					},

					"GETA^{out}" :
					{
					    "code": "@assert z \\neq @bot;\\mathsf{flag} @gets 1;@if Z = @bot @then;    Z(0) @sample \\{0,1\\}^\\lambda;    Z(1) @sample \\{0,1\\}^\\lambda;@return Z(z);",
					    "params": []
					},

					"GETBIT" :
					{
					    "code": "@assert z \\neq @bot;@return z",
					    "params": []
					},

					"GETKEYS^{in}" :
					{
					    "code": "@assert \\mathsf{flag};@return Z;",
					    "params": []
					}

				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"GAME^b_2":
				{
				    "oracles":
				    {
					"ENC":
					{
					    "code": "@assert \\mathsf{flag};@assert |m_0| = |m_1|;c @sample enc(Z(d), m_0);@if b = 1:;@> @assert z \\neq \\bot;@> @if z \\neq d @then;@> @> c @sample enc(Z(d), m_b);@return c;",
					    "params": ["d", "m_0", "m_1"]
					},

					"SETBIT" :
					{
					    "code": "@assert z = @bot;z @gets z';@return ();",
					    "params": ["z'"]
					},

					"GETA^{out}" :
					{
					    "code": "@assert z \\neq @bot;\\mathsf{flag} @gets 1;@if Z = @bot @then;    Z(0) @sample \\{0,1\\}^\\lambda;    Z(1) @sample \\{0,1\\}^\\lambda;@return Z(z);",
					    "params": []
					},

				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"GAME^b_3":
				{
				    "oracles":
				    {
					"ENC":
					{
					    "code": "@assert \\mathsf{flag};@assert |m_0| = |m_1|;c @sample enc(Z(d), m_0);@if z \\neq d @then;;;@> @> c @sample enc(Z(d), m_b);@return c;",
					    "params": ["d", "m_0", "m_1"]
					},

					"SETBIT" :
					{
					    "code": "@assert z = @bot;z @gets z';@return ();",
					    "params": ["z'"]
					},

					"GETA^{out}" :
					{
					    "code": "@assert z \\neq @bot;\\mathsf{flag} @gets 1;@if Z = @bot @then;@> Z(0) @sample \\{0,1\\}^\\lambda;@> Z(1) @sample \\{0,1\\}^\\lambda;@return Z(z);",
					    "params": []
					},

				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"GAME^b_4":
				{
				    "oracles":
				    {
					"ENC":
					{
					    "code": "@assert \\mathsf{flag};@assert |m_0| = |m_1|;c @sample enc(Z(d), m_0);@if z \\neq d @then;@> @assert k \\neq \\bot;@> @> c @sample enc(k, m_b);;@return c;",
					    "params": ["d", "m_0", "m_1"]
					},

					"SETBIT" :
					{
					    "code": "@assert z = @bot;z @gets z';@return ();",
					    "params": ["z'"]
					},

					"GETA^{out}" :
					{
					    "code": "@assert z \\neq @bot;\\mathsf{flag} @gets 1;@if Z = @bot @then;@> Z(z) @sample \\{0,1\\}^\\lambda;@> @assert k = \\bot;@> k @sample \\{0,1\\}^{\\lambda};@return Z(z);",
					    "params": []
					},

				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"RED":
				{
				    "oracles":
				    {
					"ENC":
					{
					    "code": "@assert \\mathsf{flag};@assert |m_0| = |m_1|;c @sample enc(Z(d), m_0);@if z \\neq d @then;;@> @> c @sample \\mathsf{ENC}(m_0, m_1);;@return c;",
					    "params": ["d", "m_0", "m_1"]
					},

					"SETBIT" :
					{
					    "code": "@assert z = @bot;z @gets z';@return ();",
					    "params": ["z'"]
					},

					"GETA^{out}" :
					{
					    "code": "@assert z \\neq @bot;\\mathsf{flag} @gets 1;@if Z = @bot @then;@> Z(z) @sample \\{0,1\\}^\\lambda;;@> \\mathsf{SMP}();@return Z(z);",
					    "params": []
					}
				    }
				},

				"IND-CPA^b(se)":
				{
				    "oracles":
				    {
					"SMP":
					{
					    "code": "@assert k = \\bot;k @sample \\{0,1\\}^{\\lambda};@return k",
					    "params": []
					},

					"ENC":
					{
					    "code": "@assert k \\neq \\bot;@assert |m_0| = |m_1|; c @sample enc(k, m_b);@return c",
					    "params": ["m_0", "m_1"]
					}
				    }
				}
			    }
			}
		    ]
		},

		"cuts": [

		]
	    }
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
			"name": "\\mathcal{R}^d_{\\text{circ},n,d} \\rightarrow LSEC^1_n(GB^1_{yao,n,d})",
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
		"codeq": {
		    "columns": [
			{
			    "packages":
			    {
				"GGATE_n":
				{
				    "oracles":
				    {
					"SETBIT_i":
					{
					    "code": ";;@return \\mathsf{SETBIT}_i(z)",
					    "params": ["z"]
					},

					"GETA^{out}_i":
					{
					    "code": ";;;;;@return \\mathsf{GETA}^{out}_i",
					    "params": []
					},

					"GBLG":
					{
					    "code": "\\tilde{g}_j @gets \\bot;;;;Z^{out}_j @gets \\mathsf{GETKEYS}_j^{out};;;;;;;;;;;@for (b_{\\ell},b_r) \\in \\{0,1\\}^2;@> b_j @gets op(b_{\\ell}, b_r);@> k_j @gets Z^{out}_{j}(b_j);;@> c^{0}_{in} @gets \\mathsf{ENC}_{\\ell}(b_{\\ell}, k_j, 0^{\\lambda});;;;@> c^1_{in} @gets \\mathsf{ENC}_{\\ell}(b_{\\ell}, 0^{\\lambda}, 0^{\\lambda});@> c^1_{in} @gets \\mathsf{ENC}_{r}(b_{r}, c^1_{in}, c^1_{in});;;;;@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j",
					    "params": ["\\ell", "r", "op", "j"]
					},

					"GETKEYS^{in}_j":
					{
					    "code": "@return \\mathsf{GETKEYS}^{in}_j",
					    "params": []
					},

				    }
				}

			    }
			},

			{
			    "packages":
			    {
				"GGATE_n(2)":
				{
				    "oracles":
				    {
					"SETBIT_i":
					{
					    "code": ";;@return ()",
					    "params": ["z"]
					},

					"GETA^{out}_i":
					{
					    "code": ";;;;;@return \\mathsf{GETA}^{out}_i",
					    "params": []
					},

					"GBLG":
					{
					    "code": "\\tilde{g}_j @gets \\bot;z^{in}_{\\ell} @gets \\mathsf{GETBIT}(\\ell);z^{in}_{r} @gets \\mathsf{GETBIT}(r);;Z^{out}_j @gets \\mathsf{GETKEYS}_j^{out};;;;Z^{in}_{\\ell} @gets \\mathsf{GETKEYS}^{in}_{\\ell};;;;;Z^{in}_r @gets \\mathsf{GETKEYS}^{in}_r;;@for (b_{\\ell},b_r) \\in \\{0,1\\}^2;@> b_j @gets op(b_{\\ell}, b_r);@> k^{out}_j @gets Z^{out}_{j}(b_j);@> k^{out}_j @gets Z^{in}_{\\ell}(b_{\\ell});@> @if z^{in}_{\\ell} = b_{\\ell}:;@> @> c^{0}_{in} @sample enc_(k^{in}_{\\ell}, k^{out}_{j});@> @if z^{in}_{\\ell} \\neq b_{\\ell}:;@> @> c^{0}_{in} @sample enc(k^{in}_{\\ell}, 0^{\\lambda});@> c^1_{in} @sample enc(k_{\\ell}, 0^{\\lambda});@> k^{in}_r @gets Z^{in}_r(b_r);@> @if z^{in}_{r} = b_{r}:;@> @> c @sample enc(k^{in}_r, c^0_{in});@> @if z^{in}_r \\neq b_r:;@> @> c @sample enc(k^{in}_r, c^1_{in});@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j",
					    "params": ["\\ell", "r", "op", "j"]
					},

					"GETKEYS^{in}_j":
					{
					    "code": "@return \\mathsf{GETKEYS}^{in}_j",
					    "params": []
					},

				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"GGATE_n(3)":
				{
				    "oracles":
				    {
					"SETBIT_i":
					{
					    "code": "@assert z^{in}_i = \\bot;z^{in}_i @gets z;@return ()",
					    "params": ["z"]
					},

					"GETA^{out}_i":
					{
					    "code": "@assert z^{in}_i \\neq \\bot;\\mathsf{flag}^{in}_i @gets 1;@if Z^{in}_i = \\bot:;@> Z^{in}_i(0) @sample \\{0,1\\}^\\lambda;@> Z^{in}_i(1) @sample \\{0,1\\}^\\lambda;@return Z^{in}_i(z^{in}_i)",
					    "params": []
					},

					"GBLG":
					{
					    "code": "\\tilde{g}_j @gets @bot;@assert z_{\\ell} \\neq \\bot;@assert z_r \\neq \\bot;;\\mathsf{flag}^{out}_j @gets 1;@if Z^{out}_i = \\bot:;@> Z^{out}_i(0) @sample \\{0,1\\}^\\lambda;@> Z^{out}_i(1) @sample \\{0,1\\}^\\lambda;@assert \\mathsf{flag}^{in}_{\\ell} = 1;;;;;@assert \\mathsf{flag}^{in}_r = 1;;@for (b_{\\ell},b_r) \\in \\{0,1\\}^2;;;;@> k^{in}_{\\ell} @gets Z^{in}_{\\ell}(b_{\\ell});@> k^{in}_r @gets Z^{in}_r(b_r);@> @if b_{\\ell} = z^{in}_{\\ell} \\wedge b_r = z^{in}_r:;@> @> b_j @gets op(b_{\\ell}, b_r);@> @> k^{out}_j @gets Z^{out}_j(b_j);@> @else k^{out}_j @gets 0^{\\lambda};@> c_{in} @sample enc(k^{in}_{\\ell}, k^{out}_{j});@> c @sample enc(k^{in}_r, c_{in};@> \\tilde{g} @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j",
					    "params": ["\\ell", "r", "op", "j"]
					},

					"GETKEYS^{in}_j":
					{
					    "code": "@assert \\mathsf{flag}^{out}_j = 1;@assert Z^{out}_j \\neq \\bot;@return Z^{out}_j",
					    "params": []
					}

				    }
				},
			    }
			},

			{
			    "packages":
			    {
				"GGATE_n(4)":
				{
				    "oracles":
				    {
					"SETBIT_i":
					{
					    "code": "@assert z^{in}_i = \\bot;z^{in}_i @gets z;@return ()",
					    "params": ["z"]
					},

					"GETA^{out}_i":
					{
					    "code": "@assert z^{in}_i \\neq \\bot;\\mathsf{flag}^{in}_i @gets 1;@if Z^{in}_i = \\bot:;@> Z^{in}_i(0) @sample \\{0,1\\}^\\lambda;@> Z^{in}_i(1) @sample \\{0,1\\}^\\lambda;@return Z^{in}_i(z^{in}_i)",
					    "params": []
					},

					"GBLG":
					{
					    "code": "\\tilde{g}_j @gets @bot;@assert z_{\\ell} \\neq \\bot;@assert z_r \\neq \\bot;;\\mathsf{flag}^{out}_j @gets 1;@if Z^{out}_i = \\bot:;@> Z^{out}_i(0) @sample \\{0,1\\}^\\lambda;@> Z^{out}_i(1) @sample \\{0,1\\}^\\lambda;@assert \\mathsf{flag}^{in}_{\\ell} = 1;;;;;@assert \\mathsf{flag}^{in}_r = 1;;@for (b_{\\ell} \\oplus z^{in}_{\\ell},b_r \\oplus z^{in}_r) \\in \\{0,1\\}^2;;;;@> k^{in}_{\\ell} @gets Z^{in}_{\\ell}(b_{\\ell});@> k^{in}_r @gets Z^{in}_r(b_r);@> @if b_{\\ell} \\oplus z^{in}_{\\ell} = b_r \\oplus z^{in}_r:;@> @> b_j @gets op(b_{\\ell}, b_r);@> @> k^{out}_j @gets Z^{out}_j(b_j);@> @else k^{out}_j @gets 0^{\\lambda};@> c_{in} @sample enc(k^{in}_{\\ell}, k^{out}_{j});@> c @sample enc(k^{in}_r, c_{in};@> \\tilde{g} @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j",
					    "params": ["\\ell", "r", "op", "j"]
					},

					"GETKEYS^{in}_j":
					{
					    "code": "@assert \\mathsf{flag}^{out}_j = 1;@assert Z^{out}_j \\neq \\bot;@return Z^{out}_j",
					    "params": []
					}
				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"GGATE_{sim,n}":
				{
				    "oracles":
				    {
					"SETBIT_i":
					{
					    "code": "@assert z^{in}_i = \\bot;z^{in}_i @gets z;@return ()",
					    "params": ["z"]
					},

					"GETA^{out}_i":
					{
					    "code": "@assert z^{in}_i \\neq @bot;\\mathsf{flag} @gets 1;@if Z^{in}_i = @bot @then;@> Z^{in}_i(0) @sample \\{0,1\\}^\\lambda;@> Z^{in}_i(1) @sample \\{0,1\\}^\\lambda;@return Z^{in}_i(z^{in}_i)",
					    "params": []
					},

					"GBLG":
					{
					    "code": "\\tilde{g}_j @gets \\bot;@assert z^{in}_{\ell} \\neq \\bot;@assert z^{in}_{r} \\neq \\bot;z^{out}_j @gets op(z^{in}_{\\ell}), z^{in}_{r};@assert z^{out}_j \\neq \\bot;\\mathsf{flag} @gets 1;@if Z^{out}_j = @bot @then;@> Z^{out}_j(0) @sample \\{0,1\\}^\\lambda;@> Z^{out}_j(1) @sample \\{0,1\\}^\\lambda;S^{out}_j(0) @gets Z^{out}_j(z^{in}_j);@assert \\mathsf{flag}^{in}_r = 1;S^{in}_r(0) @gets Z^{in}_r(z^{in}_r);@assert \\mathsf{flag}^{in}_r = 1;S^{in}_r(1) @gets Z^{in}_r(1 \\oplus z^{in}_r);@assert \\mathsf{flag}^{in}_{\\ell} = 1;S^{in}_{\\ell}(0) @gets Z^{in}_{\\ell}(z^{in}_{\\ell});@assert \\mathsf{flag}^{in}_{\\ell} = 1;S^{in}_{\\ell}(1) @gets Z^{in}_{\\ell}(1 \\oplus z^{in}_{\\ell});@for (d_{\\ell},d_r) \\in \\{0,1\\}^2 @do;@> k^{in}_{\\ell} @gets S^{in}_{\\ell}(d_{\\ell});@> k^{in}_r @gets S^{in}_r(d_r);@> @if d_{\\ell} = d_r = 0:;;@> @> k^{out}_j @gets S^{out}_j(0);@> @else k_j @gets 0^{\\lambda};@> c_{in} @sample enc(k^{in}_r, k^{out}_j);@> c @sample enc_{k^{in}_{\\ell}}(c_{in});@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j",
					    "params": ["\\ell", "r", "op", "j"]
					},

					"GETKEYS^{in}_j":
					{
					    "code": "@assert \\mathsf{flag}^{out}_j = 1;@assert Z^{out}_j \\neq \\bot;@return Z^{out}_j;",
					    "params": []
					},

				    }
				}
			    }
			},

			{
			    "packages":
			    {
				"GGATE_{sim,n}(2)":
				{
				    "oracles":
				    {
					"SETBIT_i":
					{
					    "code": ";;@return \\mathsf{SETBIT}_i(z)",
					    "params": ["z"]
					},

					"GETA^{out}_i":
					{
					    "code": ";;;;;@return \\mathsf{GETA}^{out}_i",
					    "params": []
					},

					"GBLG":
					{
					    "code": "\\tilde{g}_j @gets \\bot;\\mathsf{EVAL}_j(\\ell, r, op);;;S^{out}_j(0) @gets \\mathsf{GETA}^{out}_j;;;;;;S^{in}_r(0) @gets \\mathsf{GETA}^{in}_r;;S^{in}_r(1) @gets \\mathsf{GETINA}^{in}_r;;S^{in}_{\\ell}(0) @gets \\mathsf{GETA}^{in}_{\\ell};;S^{in}_{\\ell}(1) @gets \\mathsf{GETINA}^{in}_{\\ell};;@for (d_{\\ell},d_r) \\in \\{0,1\\}^2 @do;@> k^{in}_{\\ell} @gets S^{in}_{\\ell}(d_{\\ell});@> k^{in}_r @gets S^{in}_r(d_r);@> @if d_{\\ell} = d_r = 0:;;@> @> k^{out}_j @gets S^{out}_j(0);@> @else k_j @gets 0^{\\lambda};@> c_{in} @sample enc(k^{in}_r, k^{out}_j);@> c @sample enc_{k^{in}_{\\ell}}(c_{in});@> \\tilde{g}_j @gets \\tilde{g}_j \\cup c;@return \\tilde{g}_j",
					    "params": ["\\ell", "r", "op", "j"]
					},

					"GETKEYS^{in}_j":
					{
					    "code": "@return \\mathsf{GETKEYS}^{in}_j",
					    "params": []
					},

				    }
				}
			    }
			}

		    ]

		},

		"cuts": [
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
