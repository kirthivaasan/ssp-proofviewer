const proof = {
    "name": "GGM construction (PRG implies PRF)",
    "monolithic_pkgs":
    {
	"Key":
	{
	    "state": ["k"],
	    "oracles":
	    {
		"Set" :
		{
		    "params": ["idx", "k", "hon"],
		    "code": "@if Q[idx],H[idx] = k,hon :;@> @return (); @assert Q[idx] = \\bot; Q[idx] @gets k; H[idx] @gets hon; @if b_{\\mathsf{Ind}} \\wedge H[idx]: K[idx] @sample \\{0,1\\}^{|k|};@else : K[idx] @gets k;"
		},
		"Get" :
		{
		    "params": ["idx"],
		    "code": "@assert Q[idx] \\neq \\bot;@return K[idx],H[idx]"
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

	"Key^{00}_1":
	{
	    "instance": "Key"
	},

	"Key^{00}_2":
	{
	    "instance": "Key"
	},

	"Key^{00}_3":
	{
	    "instance": "Key"
	},

	"Key^{00}_4":
	{
	    "instance": "Key"
	},

	"Key^{b0}":
	{
	    "instance": "Key"
	},

	"Key^{bb}":
	{
	    "instance": "Key"
	},

	"PKey":
	{
	    "state": ["K", "H"],
	    "oracles":
	    {
		"Set" :
		{
		    "params": ["sk", "hon"],
		    "code": "@if hon: sk @sample \\mathbb{Z}_p;pk @gets g^{sk};K[pk] @gets sk;H[pk] @gets hon;@return pk"
		},

		"Get" :
		{
		    "params": ["pk"],
		    "code": "@return (K[pk],H[pk])"
		}

	    }
	},

	"Sample":
	{
	    "state": ["ctr"],
	    "oracles":
	    {
		"Smpl" :
		{
		    "params": [],
		    "code": "(k,leak) @sample \\chi;Set(ctr,k,1);ctr @gets ctr + 1;@return (ctr,leak)"
		}

	    }
	},

	"XOR":
	{
	    "state": ["T"],
	    "oracles":
	    {
		"XOR" :
		{
		    "params": ["ctx", "shards"],
		    "code": "@if T[ctx] = ] = \\bot:;@> T[ctx] @gets \\mathsf{sort}(shards);@assert T[ctx] = \\mathsf{sort}(shards); k,hon \\leftarrow{}; Get((ctx,shards); k' @gets \\bigoplus k;hon' @gets \\bigvee hon;Set(ctx,k',hon')"
		}

	    }
	},

	"PRF":
	{
	    "state": ["T"],
	    "oracles":
	    {
		"Eval" :
		{
		    "params": ["h", "ctx1"],
		    "code": "@if T[ctx1] = \\bot;@> T[ctx1] @gets h;@assert T[ctx1] = h;k,hon @gets Get(h);k' @gets f(k, ctx1, ol);Set(ctx1, k', hon)"
		}

	    }
	},

	"crPRF":
	{
	    "state": ["T", "S"],
	    "oracles":
	    {
		"CREval" :
		{
		    "params": ["h", "ctx1", "ctx2"],
		    "code": "@assert S \\neq \\bot;@if T[ctx1] = \\bot;@> T[ctx1] @gets h;@assert T[ctx1] = h;k,hon @gets Get(h);k' @gets f(k, (ctx1,ctx2), ol, S);Set((ctx1,ctx2), k', hon)"
		},
		"CRInit" :
		{
		    "params": [],
		    "code": "@assert S = \\bot;S @sample \\{0,1\\}^{sl};@return S;"
		}

	    }
	},


	"XTR":
	{
	    "state": ["S"],
	    "oracles":
	    {
		"Init" :
		{
		    "params": [],
		    "code": "@assert S = \\bot;S @sample \\{0,1\\}^{\ell};@return S"
		},
		"XTR" :
		{
		    "params": ["h"],
		    "code": "@assert S \\neq \\bot;k,hon @gets Get(h);k' @gets \\mathsf{xtr}(S,k);Set(h,k',hon)"
		}

	    }
	},

	"DH":
	{
	    "state": ["S"],
	    "oracles":
	    {
		"Pow" :
		{
		    "params": ["pkX", "pkY"],
		    "code": "@assert S = \\bot;x,xHon @gets Get(pkX);y,yHon @gets Get(pkY);@assert x \\neq \\bot \\vee y \\neq \\bot;@if x \\neq \\bot:;@> k @gets \\mathsf{xtr}(S,pkY^x);@else :;@> k @gets \\mathsf{xtr}(S,pkX^y);Set(\\mathsf{sort}(pkX,pkY),k,xHon \\wedge yHon)"
		}

	    }
	},

	"MOD-NPRF":
	{
	    "state": ["T"],
	    "oracles":
	    {
		"Eval" :
		{
		    "params": ["h", "ctx1"],
		    "code": "@if T[ctx] = \\bot:;@> T[ctx1] @gets h;@assert T[ctx1] = h;@for i \\in \\{0,..., |h| - 1\\}:;@> Eval(h_i, (ctx1,i));XOR(ctx1,(0,...,|h|-1))"
		}

	    }
	},

	"MOD-NKDF":
	{
	    "state": ["T"],
	    "oracles":
	    {
		"Init" :
		{
		    "params": [],
		    "code": "@return Init()"
		},

		"Derive" :
		{
		    "params": ["h", "ctx1"],
		    "code": "@if T[ctx1] = \\bot:;@> T[ctx1] @gets h;@assert T[ctx1] = h;@for i \\in \\{0,...,|h|-1\\}:;@> XTR(h_i);@> Eval(h_i, (ctx1,i));XOR(ctx1,(0,...,|h|-1))"
		}

	    }
	},

	"MOD-DHNKDF":
	{
	    "state": ["T"],
	    "oracles":
	    {
		"Init" :
		{
		    "params": [],
		    "code": "@return Init()"
		},

		"Derive" :
		{
		    "params": ["pkX", "pkY", "ctx1"],
		    "code": "@assert |pkX| = |pkY|;(pkX,pkY) \\leftarrow \\mathsf{sort}(pkX,pkY);@if T[ctx] = \\bot;@> T[ctx1] @gets (pkX,pkY);@assert T[ctx1] = (pkX,pkY);@for i \\in \\{0,...,|pkX|-1\\}:;@> Pow(pkX_i,pkY_i);@> XTR((pkX_i,pkY_i));@> Eval((pkX_i,pkY_i), (ctx1,i));XOR(ctx1, (0,...,|h|-1))"
		}

	    }
	},

	"MOD-crDHNKDF":
	{
	    "state": ["T"],
	    "oracles":
	    {
		"Init" :
		{
		    "params": [],
		    "code": "@return Init(), CRInit()"
		},

		"Derive" :
		{
		    "params": ["pkX", "pkY", "ctx1"],
		    "code": "@assert |pkX| = |pkY|;(pkX,pkY) \\leftarrow \\mathsf{sort}(pkX,pkY);@if T[ctx] = \\bot;@> T[ctx1] @gets (pkX,pkY);@assert T[ctx1] = (pkX,pkY);@for i \\in \\{0,...,|pkX|-1\\}:;@> Pow(pkX_i,pkY_i);@> XTR((pkX_i, pkY_i));@> Eval((pkX_i, pkY_i), (ctx1,i));XOR(ctx1, (0,...,|h|-1)); CREval(ctx1, ctx1, ctx2)"
		}

	    }
	}
    },

    "modular_pkgs":
    {
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

	"CORE^0_{NPRF}":
	{
	    "oracles": [["Key^{10}", "Set"], ["PRF", "Eval"], ["XOR", "XOR"], ["Key^{00}_1", "Get"]],

	    "graph":
	    {
		"PRF": [["Key^{10}", "Get"],["Key^{00}", "Set"]],
		"XOR": [["Key^{00}", "Get"], ["Key^{00}_1", "Set"]],
		"Key^{10}": [],
		"Key^{00}": [],
		"Key^{00}_1": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":190},"PRF":{"x":80,"y":40,"width":60,"height":50},"XOR":{"x":80,"y":100,"width":60,"height":50},"Key^{10}":{"x":200,"y":10,"width":90,"height":50},"Key^{00}":{"x":200,"y":70,"width":90,"height":50},"Key^{00}_1":{"x":200,"y":130,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{10}":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{00}_1":"exitX=0.75;exitY=0.7;entryX=0.1;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.7;exitY=0.435;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.7;exitY=0.56;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}":"exitX=0.75;exitY=0.4;entryX=0.05;entryY=0.85;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.85;exitY=0.7;entryX=0;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"XOR":{"Key^{00}":"exitX=0.85;exitY=0.3;entryX=0;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_1":"exitX=0.6;exitY=0.55;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XOR":[]}}
	},

	"CORE^1_{NPRF}":
	{
	    "oracles": [["Key^{10}", "Set"], ["PRF", "Eval"], ["XOR", "XOR"], ["Key^{00}_1", "Get"]],

	    "graph":
	    {
		"PRF": [["Key^{10}", "Get"],["Key^{10}_1", "Set"]],
		"XOR": [["Key^{10}_1", "Get"], ["Key^{00}_1", "Set"]],
		"Key^{10}": [],
		"Key^{10}_1": [],
		"Key^{00}_1": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":190},"PRF":{"x":80,"y":40,"width":60,"height":50},"XOR":{"x":80,"y":100,"width":60,"height":50},"Key^{10}":{"x":200,"y":10,"width":90,"height":50},"Key^{10}_1":{"x":200,"y":70,"width":90,"height":50},"Key^{00}_1":{"x":200,"y":130,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{10}":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{00}_1":"exitX=0.75;exitY=0.7;entryX=0.1;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.7;exitY=0.435;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.7;exitY=0.56;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}":"exitX=0.75;exitY=0.4;entryX=0.05;entryY=0.85;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_1":"exitX=0.85;exitY=0.7;entryX=0;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"XOR":{"Key^{10}_1":"exitX=0.85;exitY=0.3;entryX=0;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_1":"exitX=0.6;exitY=0.55;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XOR":[]}}
	},

	"CORE^2_{NPRF}":
	{
	    "oracles": [["Key^{10}", "Set"], ["PRF", "Eval"], ["XOR", "XOR"], ["Key^{10}_2", "Get"]],

	    "graph":
	    {
		"PRF": [["Key^{10}", "Get"],["Key^{10}_1", "Set"]],
		"XOR": [["Key^{10}_1", "Get"], ["Key^{10}_2", "Set"]],
		"Key^{10}": [],
		"Key^{10}_1": [],
		"Key^{10}_2": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":190},"PRF":{"x":80,"y":40,"width":60,"height":50},"XOR":{"x":80,"y":100,"width":60,"height":50},"Key^{10}":{"x":200,"y":10,"width":90,"height":50},"Key^{10}_1":{"x":200,"y":70,"width":90,"height":50},"Key^{10}_2":{"x":200,"y":130,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{10}":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{10}_2":"exitX=0.75;exitY=0.7;entryX=0.1;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.7;exitY=0.435;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.7;exitY=0.56;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}":"exitX=0.75;exitY=0.4;entryX=0.05;entryY=0.85;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_1":"exitX=0.85;exitY=0.7;entryX=0;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"XOR":{"Key^{10}_1":"exitX=0.85;exitY=0.3;entryX=0;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_2":"exitX=0.6;exitY=0.55;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XOR":[]}}
	},

	"CORE^3_{NPRF}":
	{
	    "oracles": [["Key^{10}", "Set"], ["PRF", "Eval"], ["XOR", "XOR"], ["Key^{10}_2", "Get"]],

	    "graph":
	    {
		"PRF": [["Key^{10}", "Get"],["Key^{00}", "Set"]],
		"XOR": [["Key^{00}", "Get"], ["Key^{10}_2", "Set"]],
		"Key^{10}": [],
		"Key^{00}": [],
		"Key^{10}_2": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":190},"PRF":{"x":80,"y":40,"width":60,"height":50},"XOR":{"x":80,"y":100,"width":60,"height":50},"Key^{10}":{"x":200,"y":10,"width":90,"height":50},"Key^{00}":{"x":200,"y":70,"width":90,"height":50},"Key^{10}_2":{"x":200,"y":130,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{10}":"exitX=0.7;exitY=0.35;entryX=0;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{10}_2":"exitX=0.75;exitY=0.7;entryX=0.1;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.7;exitY=0.435;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.7;exitY=0.56;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}":"exitX=0.75;exitY=0.4;entryX=0.05;entryY=0.85;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.85;exitY=0.7;entryX=0;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"XOR":{"Key^{00}":"exitX=0.85;exitY=0.3;entryX=0;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_2":"exitX=0.6;exitY=0.55;entryX=0;entryY=0.15;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XOR":[]}}
	},

	"NKDF":
	{
	    "oracles": [["Key^{00}_1", "CSet"], ["Sample", "Smpl"], ["MOD-NKDF", "Init"], ["MOD-NKDF", "Derive"], ["Key^{b0}", "Get"]],

	    "graph":
	    {
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"Sample": [["Key^{00}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{b0}", "Set"]],
		"MOD-NKDF": [["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{b0}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"PRF":{"x":180,"y":120,"width":60,"height":50},"XTR":{"x":180,"y":60,"width":60,"height":50},"Sample":{"x":60,"y":45,"width":90,"height":18},"XOR":{"x":180,"y":180,"width":60,"height":50},"MOD-NKDF":{"x":70,"y":70,"width":40,"height":170},"Key^{00}_1":{"x":330,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":330,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":330,"y":150,"width":90,"height":50},"Key^{b0}":{"x":330,"y":210,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Sample":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","MOD-NKDF":"exitX=0.9;exitY=0.55;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{b0}":"exitX=0.95;exitY=0.85;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"Sample":{"Key^{00}_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{b0}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"MOD-NKDF":{"XTR":"exitX=0.8;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","PRF":"exitX=0.9;exitY=0.45;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","XOR":"exitX=0.75;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XTR":[],"Sample":[],"XOR":[],"MOD-NKDF":[]}}
	},

	"CORE^0_{NKDF}":
	{
	    "oracles": [["Key^{00}_1", "CSet"], ["Sample", "Smpl"], ["Key^{00}", "Get"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"]],

	    "graph":
	    {
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"Sample": [["Key^{00}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{00}", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{00}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"PRF":{"x":80,"y":120,"width":60,"height":50},"XTR":{"x":80,"y":60,"width":60,"height":50},"Sample":{"x":60,"y":45,"width":90,"height":18},"XOR":{"x":80,"y":180,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":150,"width":90,"height":50},"Key^{00}":{"x":200,"y":210,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Sample":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.95;exitY=0.85;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;", "XTR":"exitX=0.7;exitY=0.42;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.7;exitY=0.509;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.7;exitY=0.59;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"Sample":{"Key^{00}_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XTR":[],"Sample":[],"XOR":[]}}
	},

	"CORE^1_{NKDF}":
	{
	    "oracles": [["Key^{00}_1", "CSet"], ["Sample", "Smpl"], ["Key^{00}", "Get"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"]],

	    "graph":
	    {
		"PRF": [["Key^{10}_1", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{10}_1", "Set"]],
		"Sample": [["Key^{00}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{00}", "Set"]],
		"Key^{00}_1": [],
		"Key^{10}_1": [],
		"Key^{00}_3": [],
		"Key^{00}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"PRF":{"x":80,"y":120,"width":60,"height":50},"XTR":{"x":80,"y":60,"width":60,"height":50},"Sample":{"x":60,"y":45,"width":90,"height":18},"XOR":{"x":80,"y":180,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":30,"width":90,"height":50},"Key^{10}_1":{"x":200,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":150,"width":90,"height":50},"Key^{00}":{"x":200,"y":210,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Sample":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.95;exitY=0.85;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;", "XTR":"exitX=0.7;exitY=0.42;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.7;exitY=0.509;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.7;exitY=0.59;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}_1":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_1":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"Sample":{"Key^{00}_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XTR":[],"Sample":[],"XOR":[]}}
	},

	"CORE^2_{NKDF}":
	{
	    "oracles": [["Key^{00}_1", "CSet"], ["Sample", "Smpl"], ["Key^{10}_2", "Get"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"]],

	    "graph":
	    {
		"PRF": [["Key^{10}_1", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{10}_1", "Set"]],
		"Sample": [["Key^{00}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{10}_2", "Set"]],
		"Key^{00}_1": [],
		"Key^{10}_1": [],
		"Key^{00}_3": [],
		"Key^{10}_2": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"PRF":{"x":80,"y":120,"width":60,"height":50},"XTR":{"x":80,"y":60,"width":60,"height":50},"Sample":{"x":60,"y":45,"width":90,"height":18},"XOR":{"x":80,"y":180,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":30,"width":90,"height":50},"Key^{10}_1":{"x":200,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":150,"width":90,"height":50},"Key^{10}_2":{"x":200,"y":210,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Sample":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{10}_2":"exitX=0.95;exitY=0.85;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;", "XTR":"exitX=0.7;exitY=0.42;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.7;exitY=0.509;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.7;exitY=0.59;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}_1":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_1":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"Sample":{"Key^{00}_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XTR":[],"Sample":[],"XOR":[]}}
	},

	"CORE^3_{NKDF}":
	{
	    "oracles": [["Key^{00}_1", "CSet"], ["Sample", "Smpl"], ["Key^{10}_2", "Get"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"]],

	    "graph":
	    {
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"Sample": [["Key^{00}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{10}_2", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{10}_2": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"PRF":{"x":80,"y":120,"width":60,"height":50},"XTR":{"x":80,"y":60,"width":60,"height":50},"Sample":{"x":60,"y":45,"width":90,"height":18},"XOR":{"x":80,"y":180,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":150,"width":90,"height":50},"Key^{10}_2":{"x":200,"y":210,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Sample":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{10}_2":"exitX=0.95;exitY=0.85;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;", "XTR":"exitX=0.7;exitY=0.42;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.7;exitY=0.509;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.7;exitY=0.59;entryX=0.15;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"Sample":{"Key^{00}_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XTR":[],"Sample":[],"XOR":[]}}
	},

	"DHNKDF":
	{
	    "oracles": [["PKey", "Set"], ["MOD-DHNKDF", "Init"], ["MOD-DHNKDF", "Derive"], ["Key^{b0}", "Get"]],

	    "graph":
	    {
		"DH": [["PKey", "Get"], ["Key^{00}_1", "Set"]],
		"PKey": [],
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{b0}", "Set"]],
		"MOD-DHNKDF": [["DH", "Pow"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{b0}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"PRF":{"x":180,"y":150,"width":60,"height":50},"DH":{"x":180,"y":30,"width":60,"height":50},"PKey":{"x":330,"y":0,"width":90,"height":50}, "XTR":{"x":180,"y":90,"width":60,"height":50},"XOR":{"x":180,"y":210,"width":60,"height":50},"MOD-DHNKDF":{"x":70,"y":30,"width":40,"height":230},"Key^{00}_1":{"x":330,"y":60,"width":90,"height":50},"Key^{00}_2":{"x":330,"y":120,"width":90,"height":50},"Key^{00}_3":{"x":330,"y":180,"width":90,"height":50},"Key^{b0}":{"x":330,"y":240,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PKey":"exitX=0.7;exitY=0.31;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","MOD-DHNKDF":"exitX=0.9;exitY=0.55;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{b0}":"exitX=0.95;exitY=0.95;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"DH":{"PKey":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.75;entryPerimeter=1;","Key^{00}_1":"exitX=1;exitY=0.75;exitPerimeter=1;entryX=0;entryY=0.15;entryPerimeter=1;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{b0}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"MOD-DHNKDF":{"DH":"exitX=1;exitY=0.1;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","XTR":"exitX=0.8;exitY=0.42;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","PRF":"exitX=0.9;exitY=0.61;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","XOR":"exitX=0.75;exitY=0.7;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[], "DH":[], "PKey": [], "PRF":[],"XTR":[],"XOR":[],"MOD-DHNKDF":[]}}
	},

	"CORE^0_{DHNKDF}":
	{
	    "oracles": [["PKey", "Set"], ["Key^{00}", "Get"], ["DH", "Pow"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"]],

	    "graph":
	    {
		"DH": [["PKey", "Get"], ["Key^{00}_1", "Set"]],
		"PKey": [],
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{00}", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{00}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":280},"PRF":{"x":80,"y":150,"width":60,"height":50},"DH":{"x":80,"y":30,"width":60,"height":50},"PKey":{"x":200,"y":0,"width":90,"height":50}, "XTR":{"x":80,"y":90,"width":60,"height":50},"XOR":{"x":80,"y":210,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":60,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":120,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":180,"width":90,"height":50},"Key^{00}":{"x":200,"y":240,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PKey":"exitX=0.7;exitY=0.31;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{00}":"exitX=0.95;exitY=0.95;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;", "DH":"exitX=0.95;exitY=0.23;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XTR":"exitX=0.95;exitY=0.42;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.95;exitY=0.61;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.95;exitY=0.805;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"DH":{"PKey":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.75;entryPerimeter=1;","Key^{00}_1":"exitX=1;exitY=0.75;exitPerimeter=1;entryX=0;entryY=0.15;entryPerimeter=1;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[], "DH":[], "PKey": [], "PRF":[],"XTR":[],"XOR":[]}}
	},

	"CORE^1_{DHNKDF}":
	{
	    "oracles": [["PKey", "Set"], ["Key^{00}", "Get"], ["DH", "Pow"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"]],

	    "graph":
	    {
		"DH": [["PKey", "Get"], ["Key^{00}_1", "Set"]],
		"PKey": [],
		"PRF": [["Key^{10}_1", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{10}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{00}", "Set"]],
		"Key^{00}_1": [],
		"Key^{10}_1": [],
		"Key^{00}_3": [],
		"Key^{00}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":280},"PRF":{"x":80,"y":150,"width":60,"height":50},"DH":{"x":80,"y":30,"width":60,"height":50},"PKey":{"x":200,"y":0,"width":90,"height":50}, "XTR":{"x":80,"y":90,"width":60,"height":50},"XOR":{"x":80,"y":210,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":60,"width":90,"height":50},"Key^{10}_1":{"x":200,"y":120,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":180,"width":90,"height":50},"Key^{00}":{"x":200,"y":240,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PKey":"exitX=0.7;exitY=0.31;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{00}":"exitX=0.95;exitY=0.95;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;", "DH":"exitX=0.95;exitY=0.23;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XTR":"exitX=0.95;exitY=0.42;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.95;exitY=0.61;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.95;exitY=0.805;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"DH":{"PKey":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.75;entryPerimeter=1;","Key^{00}_1":"exitX=1;exitY=0.75;exitPerimeter=1;entryX=0;entryY=0.15;entryPerimeter=1;"},"PRF":{"Key^{10}_1":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_1":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[], "DH":[], "PKey": [], "PRF":[],"XTR":[],"XOR":[]}}
	},

	"CORE^2_{DHNKDF}":
	{
	    "oracles": [["PKey", "Set"], ["Key^{10}_2", "Get"], ["DH", "Pow"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"]],

	    "graph":
	    {
		"DH": [["PKey", "Get"], ["Key^{00}_1", "Set"]],
		"PKey": [],
		"PRF": [["Key^{10}_1", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{10}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{10}_2", "Set"]],
		"Key^{00}_1": [],
		"Key^{10}_1": [],
		"Key^{00}_3": [],
		"Key^{10}_2": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":280},"PRF":{"x":80,"y":150,"width":60,"height":50},"DH":{"x":80,"y":30,"width":60,"height":50},"PKey":{"x":200,"y":0,"width":90,"height":50}, "XTR":{"x":80,"y":90,"width":60,"height":50},"XOR":{"x":80,"y":210,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":60,"width":90,"height":50},"Key^{10}_1":{"x":200,"y":120,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":180,"width":90,"height":50},"Key^{10}_2":{"x":200,"y":240,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PKey":"exitX=0.7;exitY=0.31;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{10}_2":"exitX=0.95;exitY=0.95;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;", "DH":"exitX=0.95;exitY=0.23;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XTR":"exitX=0.95;exitY=0.42;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.95;exitY=0.61;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.95;exitY=0.805;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"DH":{"PKey":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.75;entryPerimeter=1;","Key^{00}_1":"exitX=1;exitY=0.75;exitPerimeter=1;entryX=0;entryY=0.15;entryPerimeter=1;"},"PRF":{"Key^{10}_1":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_1":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[], "DH":[], "PKey": [], "PRF":[],"XTR":[],"XOR":[]}}
	},

	"CORE^3_{DHNKDF}":
	{
	    "oracles": [["PKey", "Set"], ["Key^{10}_2", "Get"], ["DH", "Pow"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"]],

	    "graph":
	    {
		"DH": [["PKey", "Get"], ["Key^{00}_1", "Set"]],
		"PKey": [],
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{10}_2", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{10}_2": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":280},"PRF":{"x":80,"y":150,"width":60,"height":50},"DH":{"x":80,"y":30,"width":60,"height":50},"PKey":{"x":200,"y":0,"width":90,"height":50}, "XTR":{"x":80,"y":90,"width":60,"height":50},"XOR":{"x":80,"y":210,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":60,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":120,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":180,"width":90,"height":50},"Key^{10}_2":{"x":200,"y":240,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PKey":"exitX=0.7;exitY=0.31;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{10}_2":"exitX=0.95;exitY=0.95;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;", "DH":"exitX=0.95;exitY=0.23;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XTR":"exitX=0.95;exitY=0.42;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.95;exitY=0.61;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.95;exitY=0.805;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"DH":{"PKey":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.75;entryPerimeter=1;","Key^{00}_1":"exitX=1;exitY=0.75;exitPerimeter=1;entryX=0;entryY=0.15;entryPerimeter=1;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[], "DH":[], "PKey": [], "PRF":[],"XTR":[],"XOR":[]}}
	},

	"crNPRF":
	{
	    "oracles": [["Key^{10}", "Set"], ["MOD-crNPRF", "Eval"], ["Key^{bb}", "Get"]],

	    "graph":
	    {
		"XOR": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"PRF": [["Key^{10}", "Get"], ["Key^{00}_2", "Set"]],
		"crPRF": [["Key^{00}_3", "Get"], ["Key^{bb}", "Set"]],
		"MOD-crNPRF": [["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"]],
		"Key^{10}": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{bb}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"XOR":{"x":180,"y":120,"width":60,"height":50},"PRF":{"x":180,"y":60,"width":60,"height":50},"crPRF":{"x":180,"y":180,"width":60,"height":50},"MOD-crNPRF":{"x":70,"y":70,"width":40,"height":170},"Key^{10}":{"x":330,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":330,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":330,"y":150,"width":90,"height":50},"Key^{bb}":{"x":330,"y":210,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{10}":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","MOD-crNPRF":"exitX=0.9;exitY=0.55;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{bb}":"exitX=0.95;exitY=0.85;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XOR":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"crPRF":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{bb}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"MOD-crNPRF":{"PRF":"exitX=0.8;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","XOR":"exitX=0.9;exitY=0.45;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","crPRF":"exitX=0.75;exitY=0.65;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[],"XOR":[],"PRF":[],"crPRF":[],"MOD-crNPRF":[]}}
	},

	"CORE^0_{crNPRF}":
	{
	    "oracles": [["Key^{10}", "Set"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"], ["Key^{00}", "Get"]],

	    "graph":
	    {
		"XOR": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"PRF": [["Key^{10}", "Get"], ["Key^{00}_2", "Set"]],
		"crPRF": [["Key^{00}_3", "Get"], ["Key^{00}", "Set"]],
		"Key^{10}": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{00}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"XOR":{"x":80,"y":120,"width":60,"height":50},"PRF":{"x":80,"y":60,"width":60,"height":50},"crPRF":{"x":80,"y":180,"width":60,"height":50},"Key^{10}":{"x":200,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":150,"width":90,"height":50},"Key^{00}":{"x":200,"y":210,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{10}":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{00}":"exitX=0.95;exitY=0.85;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.95;exitY=0.323;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.95;exitY=0.523;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","crPRF":"exitX=0.95;exitY=0.7;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XOR":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"crPRF":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"XOR":[],"PRF":[],"crPRF":[]}}
	},

	"CORE^1_{crNPRF}":
	{
	    "oracles": [["Key^{10}", "Set"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"], ["Key^{00}", "Get"]],

	    "graph":
	    {
		"XOR": [["Key^{00}_2", "Get"],["Key^{10}_1", "Set"]],
		"PRF": [["Key^{10}", "Get"], ["Key^{00}_2", "Set"]],
		"crPRF": [["Key^{10}_1", "Get"], ["Key^{00}", "Set"]],
		"Key^{10}": [],
		"Key^{00}_2": [],
		"Key^{10}_1": [],
		"Key^{00}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"XOR":{"x":80,"y":120,"width":60,"height":50},"PRF":{"x":80,"y":60,"width":60,"height":50},"crPRF":{"x":80,"y":180,"width":60,"height":50},"Key^{10}":{"x":200,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":90,"width":90,"height":50},"Key^{10}_1":{"x":200,"y":150,"width":90,"height":50},"Key^{00}":{"x":200,"y":210,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{10}":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{00}":"exitX=0.95;exitY=0.85;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.95;exitY=0.323;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.95;exitY=0.523;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","crPRF":"exitX=0.95;exitY=0.7;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XOR":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_1":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"crPRF":{"Key^{10}_1":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"XOR":[],"PRF":[],"crPRF":[]}}
	},

	"CORE^2_{crNPRF}":
	{
	    "oracles": [["Key^{10}", "Set"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"], ["Key^{11}", "Get"]],

	    "graph":
	    {
		"XOR": [["Key^{00}_2", "Get"],["Key^{10}_1", "Set"]],
		"PRF": [["Key^{10}", "Get"], ["Key^{00}_2", "Set"]],
		"crPRF": [["Key^{10}_1", "Get"], ["Key^{11}", "Set"]],
		"Key^{10}": [],
		"Key^{00}_2": [],
		"Key^{10}_1": [],
		"Key^{11}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"XOR":{"x":80,"y":120,"width":60,"height":50},"PRF":{"x":80,"y":60,"width":60,"height":50},"crPRF":{"x":80,"y":180,"width":60,"height":50},"Key^{10}":{"x":200,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":90,"width":90,"height":50},"Key^{10}_1":{"x":200,"y":150,"width":90,"height":50},"Key^{11}":{"x":200,"y":210,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{10}":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{11}":"exitX=0.95;exitY=0.85;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.95;exitY=0.323;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.95;exitY=0.523;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","crPRF":"exitX=0.95;exitY=0.7;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XOR":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}_1":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"crPRF":{"Key^{10}_1":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{11}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"XOR":[],"PRF":[],"crPRF":[]}}
	},

	"CORE^3_{crNPRF}":
	{
	    "oracles": [["Key^{10}", "Set"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"], ["Key^{11}", "Get"]],

	    "graph":
	    {
		"XOR": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"PRF": [["Key^{10}", "Get"], ["Key^{00}_2", "Set"]],
		"crPRF": [["Key^{00}_3", "Get"], ["Key^{11}", "Set"]],
		"Key^{10}": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{11}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":280},"XOR":{"x":80,"y":120,"width":60,"height":50},"PRF":{"x":80,"y":60,"width":60,"height":50},"crPRF":{"x":80,"y":180,"width":60,"height":50},"Key^{10}":{"x":200,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":150,"width":90,"height":50},"Key^{11}":{"x":200,"y":210,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{10}":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Key^{11}":"exitX=0.95;exitY=0.85;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.95;exitY=0.323;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.95;exitY=0.523;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","crPRF":"exitX=0.95;exitY=0.7;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XOR":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{10}":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"crPRF":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{11}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"}},"edge_points":{"@oracles_interface":[],"XOR":[],"PRF":[],"crPRF":[]}}
	},

	"crNKDF":
	{
	    "oracles": [["Key^{00}_1", "CSet"], ["Sample", "Smpl"], ["MOD-crNKDF", "Init"], ["MOD-crNKDF", "Derive"], ["Key^{bb}", "Get"]],

	    "graph":
	    {
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"Sample": [["Key^{00}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{00}_4", "Set"]],
		"crPRF": [["Key^{00}_4", "Get"], ["Key^{bb}", "Set"]],
		"MOD-crNKDF": [["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{00}_4": [],
		"Key^{bb}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":310},"PRF":{"x":180,"y":120,"width":60,"height":50},"XTR":{"x":180,"y":60,"width":60,"height":50},"Sample":{"x":60,"y":45,"width":90,"height":18},"XOR":{"x":180,"y":180,"width":60,"height":50},"crPRF":{"x":180,"y":240,"width":60,"height":50},"MOD-crNKDF":{"x":70,"y":70,"width":40,"height":220},"Key^{00}_1":{"x":330,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":330,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":330,"y":150,"width":90,"height":50},"Key^{00}_4":{"x":330,"y":210,"width":90,"height":50},"Key^{bb}":{"x":330,"y":270,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Sample":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","MOD-crNKDF":"exitX=0.9;exitY=0.55;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{bb}":"exitX=0.85;exitY=0.96;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"Sample":{"Key^{00}_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_4":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"crPRF":{"Key^{00}_4":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{bb}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"MOD-crNKDF":{"XTR":"exitX=0.8;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","PRF":"exitX=0.9;exitY=0.375;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","XOR":"exitX=0.75;exitY=0.56;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","crPRF":"exitX=0.9;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XTR":[],"Sample":[],"XOR":[],"MOD-crNKDF":[]}}
	},

	"CORE^0_{crNKDF}":
	{
	    "oracles": [["Key^{00}_1", "CSet"], ["Sample", "Smpl"], ["Key^{00}", "Get"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"]],

	    "graph":
	    {
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"Sample": [["Key^{00}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{00}_4", "Set"]],
		"crPRF": [["Key^{00}_4", "Get"], ["Key^{00}", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{00}_4": [],
		"Key^{00}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":310},"PRF":{"x":80,"y":120,"width":60,"height":50},"XTR":{"x":80,"y":60,"width":60,"height":50},"Sample":{"x":60,"y":45,"width":90,"height":18},"XOR":{"x":80,"y":180,"width":60,"height":50},"crPRF":{"x":80,"y":240,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":150,"width":90,"height":50},"Key^{00}_4":{"x":200,"y":210,"width":90,"height":50},"Key^{00}":{"x":200,"y":270,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Sample":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.85;exitY=0.96;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XTR":"exitX=0.85;exitY=0.34;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.85;exitY=0.475;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.85;exitY=0.61;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","crPRF":"exitX=0.85;exitY=0.75;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"Sample":{"Key^{00}_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_4":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"crPRF":{"Key^{00}_4":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XTR":[],"Sample":[],"XOR":[]}}
	},

	"CORE^1_{crNKDF}":
	{
	    "oracles": [["Key^{00}_1", "CSet"], ["Sample", "Smpl"], ["Key^{00}", "Get"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"]],

	    "graph":
	    {
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"Sample": [["Key^{00}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{10}", "Set"]],
		"crPRF": [["Key^{10}", "Get"], ["Key^{00}", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{10}": [],
		"Key^{00}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":310},"PRF":{"x":80,"y":120,"width":60,"height":50},"XTR":{"x":80,"y":60,"width":60,"height":50},"Sample":{"x":60,"y":45,"width":90,"height":18},"XOR":{"x":80,"y":180,"width":60,"height":50},"crPRF":{"x":80,"y":240,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":150,"width":90,"height":50},"Key^{10}":{"x":200,"y":210,"width":90,"height":50},"Key^{00}":{"x":200,"y":270,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Sample":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.85;exitY=0.96;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XTR":"exitX=0.85;exitY=0.34;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.85;exitY=0.475;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.85;exitY=0.61;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","crPRF":"exitX=0.85;exitY=0.75;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"Sample":{"Key^{00}_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"crPRF":{"Key^{10}":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XTR":[],"Sample":[],"XOR":[]}}
	},

	"CORE^2_{crNKDF}":
	{
	    "oracles": [["Key^{00}_1", "CSet"], ["Sample", "Smpl"], ["Key^{11}", "Get"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"]],

	    "graph":
	    {
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"Sample": [["Key^{00}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{10}", "Set"]],
		"crPRF": [["Key^{10}", "Get"], ["Key^{11}", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{10}": [],
		"Key^{11}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":310},"PRF":{"x":80,"y":120,"width":60,"height":50},"XTR":{"x":80,"y":60,"width":60,"height":50},"Sample":{"x":60,"y":45,"width":90,"height":18},"XOR":{"x":80,"y":180,"width":60,"height":50},"crPRF":{"x":80,"y":240,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":150,"width":90,"height":50},"Key^{10}":{"x":200,"y":210,"width":90,"height":50},"Key^{11}":{"x":200,"y":270,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Sample":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{11}":"exitX=0.85;exitY=0.96;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XTR":"exitX=0.85;exitY=0.34;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.85;exitY=0.475;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.85;exitY=0.61;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","crPRF":"exitX=0.85;exitY=0.75;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"Sample":{"Key^{00}_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{10}":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"crPRF":{"Key^{10}":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{11}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XTR":[],"Sample":[],"XOR":[]}}
	},

	"CORE^3_{crNKDF}":
	{
	    "oracles": [["Key^{00}_1", "CSet"], ["Sample", "Smpl"], ["Key^{11}", "Get"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"]],

	    "graph":
	    {
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"Sample": [["Key^{00}_1", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{00}_4", "Set"]],
		"crPRF": [["Key^{00}_4", "Get"], ["Key^{11}", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{00}_4": [],
		"Key^{11}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":310},"PRF":{"x":80,"y":120,"width":60,"height":50},"XTR":{"x":80,"y":60,"width":60,"height":50},"Sample":{"x":60,"y":45,"width":90,"height":18},"XOR":{"x":80,"y":180,"width":60,"height":50},"crPRF":{"x":80,"y":240,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":30,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":90,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":150,"width":90,"height":50},"Key^{00}_4":{"x":200,"y":210,"width":90,"height":50},"Key^{11}":{"x":200,"y":270,"width":90,"height":50}},"edges":{"@oracles_interface":{"Key^{00}_1":"exitX=0.7;exitY=0.35;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Sample":"exitX=0.9;exitY=0.25;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{11}":"exitX=0.85;exitY=0.96;entryX=0;entryY=0.75;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XTR":"exitX=0.85;exitY=0.34;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","PRF":"exitX=0.85;exitY=0.475;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","XOR":"exitX=0.85;exitY=0.61;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","crPRF":"exitX=0.85;exitY=0.75;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"PRF":{"Key^{00}_2":"exitX=0.6;exitY=0.45;entryX=0.1;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_3":"exitX=0.65;exitY=0.6;entryX=0.05;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"XTR":{"Key^{00}_1":"exitX=0.85;exitY=0.3;entryX=0.15;entryY=0.75;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_2":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;entryDx=0;entryDy=0;exitDx=0;exitDy=0;"},"Sample":{"Key^{00}_1":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=0.6;exitY=0.45;entryX=0.05;entryY=0.8;entryDx=0;entryDy=0;exitDx=0;exitDy=0;","Key^{00}_4":"exitX=0.6;exitY=0.55;entryX=0.15;entryY=0.25;exitDx=0;exitDy=0;entryDx=0;entryDy=0;"},"crPRF":{"Key^{00}_4":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{11}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[],"PRF":[],"XTR":[],"Sample":[],"XOR":[]}}
	},

	"crDHNKDF":
	{
	    "oracles": [["PKey", "Set"], ["MOD-crDHNKDF", "Init"], ["MOD-crDHNKDF", "Derive"], ["Key^{bb}", "Get"]],

	    "graph":
	    {
		"DH": [["PKey", "Get"], ["Key^{00}_1", "Set"]],
		"PKey": [],
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"crPRF": [["Key^{00}_4", "Get"],["Key^{bb}", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{00}_4", "Set"]],
		"MOD-crDHNKDF": [["DH", "Pow"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{00}_4": [],
		"Key^{bb}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":20,"height":350},"PRF":{"x":180,"y":150,"width":60,"height":50},"DH":{"x":180,"y":30,"width":60,"height":50},"PKey":{"x":330,"y":0,"width":90,"height":50}, "XTR":{"x":180,"y":90,"width":60,"height":50},"XOR":{"x":180,"y":210,"width":60,"height":50},"crPRF":{"x":180,"y":270,"width":60,"height":50},"MOD-crDHNKDF":{"x":70,"y":30,"width":40,"height":290},"Key^{00}_1":{"x":330,"y":60,"width":90,"height":50},"Key^{00}_2":{"x":330,"y":120,"width":90,"height":50},"Key^{00}_3":{"x":330,"y":180,"width":90,"height":50},"Key^{00}_4":{"x":330,"y":240,"width":90,"height":50},"Key^{bb}":{"x":330,"y":300,"width":90,"height":50}},"edges":{"@oracles_interface":{"PKey":"exitX=0.95;exitY=0.08;entryX=0;entryY=0.2;entryPerimeter=1;exitDx=0;exitDy=0;","MOD-crDHNKDF":"exitX=0.5;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{bb}":"exitX=0.85;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"DH":{"PKey":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_1":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"PRF":{"Key^{00}_2":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_3":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"crPRF":{"Key^{00}_4":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{bb}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"XTR":{"Key^{00}_1":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_2":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_4":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"MOD-crDHNKDF":{"DH":"exitX=0.85;exitY=0.2;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","XTR":"exitX=0.75;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","PRF":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","XOR":"exitX=0.95;exitY=0.7;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","crPRF":"exitX=1;exitY=0.95;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"}},"edge_points":{"@oracles_interface":[], "DH":[], "PKey": [], "PRF":[],"XTR":[],"XOR":[],"crPRF":[],"MOD-crDHNKDF":[]}}
	},

	"CORE^0_{crDHNKDF}":
	{
	    "oracles": [["PKey", "Set"], ["DH", "Pow"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"], ["Key^{00}", "Get"]],

	    "graph":
	    {
		"DH": [["PKey", "Get"], ["Key^{00}_1", "Set"]],
		"PKey": [],
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"crPRF": [["Key^{00}_4", "Get"],["Key^{00}", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{00}_4", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{00}_4": [],
		"Key^{00}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":350},"PRF":{"x":80,"y":150,"width":60,"height":50},"DH":{"x":80,"y":30,"width":60,"height":50},"PKey":{"x":200,"y":0,"width":90,"height":50}, "XTR":{"x":80,"y":90,"width":60,"height":50},"XOR":{"x":80,"y":210,"width":60,"height":50},"crPRF":{"x":80,"y":270,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":60,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":120,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":180,"width":90,"height":50},"Key^{00}_4":{"x":200,"y":240,"width":90,"height":50},"Key^{00}":{"x":200,"y":300,"width":90,"height":50}},"edges":{"@oracles_interface":{"PKey":"exitX=0.95;exitY=0.08;entryX=0;entryY=0.2;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.85;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","DH":"exitX=1;exitY=0.16;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","XTR":"exitX=1;exitY=0.33;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","PRF":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;", "XOR":"exitX=1;exitY=0.67;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;", "crPRF":"exitX=1;exitY=0.85;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"DH":{"PKey":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_1":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"PRF":{"Key^{00}_2":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_3":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"crPRF":{"Key^{00}_4":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"XTR":{"Key^{00}_1":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_2":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_4":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[], "DH":[], "PKey": [], "PRF":[],"XTR":[],"XOR":[],"crPRF":[]}}
	},

	"CORE^1_{crDHNKDF}":
	{
	    "oracles": [["PKey", "Set"], ["DH", "Pow"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"], ["Key^{00}", "Get"]],

	    "graph":
	    {
		"DH": [["PKey", "Get"], ["Key^{00}_1", "Set"]],
		"PKey": [],
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"crPRF": [["Key^{10}", "Get"],["Key^{00}", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{10}", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{10}": [],
		"Key^{00}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":350},"PRF":{"x":80,"y":150,"width":60,"height":50},"DH":{"x":80,"y":30,"width":60,"height":50},"PKey":{"x":200,"y":0,"width":90,"height":50}, "XTR":{"x":80,"y":90,"width":60,"height":50},"XOR":{"x":80,"y":210,"width":60,"height":50},"crPRF":{"x":80,"y":270,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":60,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":120,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":180,"width":90,"height":50},"Key^{10}":{"x":200,"y":240,"width":90,"height":50},"Key^{00}":{"x":200,"y":300,"width":90,"height":50}},"edges":{"@oracles_interface":{"PKey":"exitX=0.95;exitY=0.08;entryX=0;entryY=0.2;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{00}":"exitX=0.85;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","DH":"exitX=1;exitY=0.16;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","XTR":"exitX=1;exitY=0.33;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","PRF":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;", "XOR":"exitX=1;exitY=0.67;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;", "crPRF":"exitX=1;exitY=0.85;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"DH":{"PKey":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_1":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"PRF":{"Key^{00}_2":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_3":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"crPRF":{"Key^{10}":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"XTR":{"Key^{00}_1":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_2":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{10}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[], "DH":[], "PKey": [], "PRF":[],"XTR":[],"XOR":[],"crPRF":[]}}
	},

	"CORE^2_{crDHNKDF}":
	{
	    "oracles": [["PKey", "Set"], ["DH", "Pow"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"], ["Key^{11}", "Get"]],

	    "graph":
	    {
		"DH": [["PKey", "Get"], ["Key^{00}_1", "Set"]],
		"PKey": [],
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"crPRF": [["Key^{10}", "Get"],["Key^{11}", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{10}", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{10}": [],
		"Key^{11}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":350},"PRF":{"x":80,"y":150,"width":60,"height":50},"DH":{"x":80,"y":30,"width":60,"height":50},"PKey":{"x":200,"y":0,"width":90,"height":50}, "XTR":{"x":80,"y":90,"width":60,"height":50},"XOR":{"x":80,"y":210,"width":60,"height":50},"crPRF":{"x":80,"y":270,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":60,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":120,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":180,"width":90,"height":50},"Key^{10}":{"x":200,"y":240,"width":90,"height":50},"Key^{11}":{"x":200,"y":300,"width":90,"height":50}},"edges":{"@oracles_interface":{"PKey":"exitX=0.95;exitY=0.08;entryX=0;entryY=0.2;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{11}":"exitX=0.85;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","DH":"exitX=1;exitY=0.16;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","XTR":"exitX=1;exitY=0.33;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","PRF":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;", "XOR":"exitX=1;exitY=0.67;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;", "crPRF":"exitX=1;exitY=0.85;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"DH":{"PKey":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_1":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"PRF":{"Key^{00}_2":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_3":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"crPRF":{"Key^{10}":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{11}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"XTR":{"Key^{00}_1":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_2":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{10}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[], "DH":[], "PKey": [], "PRF":[],"XTR":[],"XOR":[],"crPRF":[]}}
	},

	"CORE^3_{crDHNKDF}":
	{
	    "oracles": [["PKey", "Set"], ["DH", "Pow"], ["XTR", "Init"], ["XTR", "XTR"], ["PRF", "Eval"], ["XOR", "XOR"], ["crPRF", "CRInit"], ["crPRF", "CREval"], ["Key^{11}", "Get"]],

	    "graph":
	    {
		"DH": [["PKey", "Get"], ["Key^{00}_1", "Set"]],
		"PKey": [],
		"PRF": [["Key^{00}_2", "Get"],["Key^{00}_3", "Set"]],
		"crPRF": [["Key^{00}_4", "Get"],["Key^{11}", "Set"]],
		"XTR": [["Key^{00}_1", "Get"], ["Key^{00}_2", "Set"]],
		"XOR": [["Key^{00}_3", "Get"], ["Key^{00}_4", "Set"]],
		"Key^{00}_1": [],
		"Key^{00}_2": [],
		"Key^{00}_3": [],
		"Key^{00}_4": [],
		"Key^{11}": []
	    },

	    "layout": {"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":350},"PRF":{"x":80,"y":150,"width":60,"height":50},"DH":{"x":80,"y":30,"width":60,"height":50},"PKey":{"x":200,"y":0,"width":90,"height":50}, "XTR":{"x":80,"y":90,"width":60,"height":50},"XOR":{"x":80,"y":210,"width":60,"height":50},"crPRF":{"x":80,"y":270,"width":60,"height":50},"Key^{00}_1":{"x":200,"y":60,"width":90,"height":50},"Key^{00}_2":{"x":200,"y":120,"width":90,"height":50},"Key^{00}_3":{"x":200,"y":180,"width":90,"height":50},"Key^{00}_4":{"x":200,"y":240,"width":90,"height":50},"Key^{11}":{"x":200,"y":300,"width":90,"height":50}},"edges":{"@oracles_interface":{"PKey":"exitX=0.95;exitY=0.08;entryX=0;entryY=0.2;entryPerimeter=1;exitDx=0;exitDy=0;","Key^{11}":"exitX=0.85;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","DH":"exitX=1;exitY=0.16;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","XTR":"exitX=1;exitY=0.33;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;","PRF":"exitX=1;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;", "XOR":"exitX=1;exitY=0.67;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;", "crPRF":"exitX=1;exitY=0.85;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"DH":{"PKey":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_1":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"PRF":{"Key^{00}_2":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_3":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"crPRF":{"Key^{00}_4":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{11}":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"XTR":{"Key^{00}_1":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_2":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"},"XOR":{"Key^{00}_3":"exitX=1;exitY=0.2;exitPerimeter=1;entryX=0;entryY=0.8;entryPerimeter=1;","Key^{00}_4":"exitX=1;exitY=0.8;exitPerimeter=1;entryX=0;entryY=0.2;entryPerimeter=1;"}},"edge_points":{"@oracles_interface":[], "DH":[], "PKey": [], "PRF":[],"XTR":[],"XOR":[],"crPRF":[]}}
	}
    },

    "prooftree":
    {
	"Theorems" :
	{
	    "parent": null,
	    "contents": [
		{
		    "text": "Theorem 1 (NPRF), Theorem 2 (crNPRF), Theorem 3 (NKDF), Theorem 4 (crNKDF), Theorem 5 (DHNKDF), Theorem 6 (crDHNKDF)"
		}
	    ]
	},

	"Claim 1" :
	{
	    "longname": "Claim 1(GNPRF and GcrNPRF Decomposition)",
	    "parent": "Theorems",
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs": [["NPRF", "crNPRF"]]
		}
	    ]
	},

	"Claim 2" :
	{
	    "longname": "Claim 2 (GNKDF and GcrNKDF Decomposition)",
	    "parent": "Theorems",
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs": [["NKDF", "crNKDF"]]
		}
	    ]
	},

	"Claim 3" :
	{
	    "longname": "Claim 3 (GDHNKDF and GcrDHNKDF Decomposition)",
	    "parent": "Theorems",
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs": [["DHNKDF", "crDHNKDF"]]
		}
	    ]
	},

	"Lemma 1" :
	{
	    "longname": "Lemma 1 (\\(\\mathsf{CORE_{GNPRF}}\\))",
	    "parent": "Theorems",
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs": [["CORE^0_{NPRF}", "CORE^1_{NPRF}", "CORE^2_{NPRF}", "CORE^3_{NPRF}"]]
		}

	    ],
	    "type":
	    {
		"reduction": [
		    {
			"i": 0, "j": 1, "cut": ["XOR", "Key^{00}_1"]
		    },
		    {
			"i": 0, "j": 2, "cut": ["PRF", "Key^{10}"]
		    },
		    {
			"i": 0, "j": 3, "cut": ["XOR", "Key^{10}_2"]
		    }
		]
	    }
	},

	"Lemma 2" :
	{
	    "longname": "Lemma 2 (\\(\\mathsf{CORE_{GcrNPRF}}\\))",
	    "parent": "Lemma 1",
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs": [["CORE^0_{crNPRF}", "CORE^1_{crNPRF}", "CORE^2_{crNPRF}", "CORE^3_{crNPRF}"]]
		}

	    ],
	    "type":
	    {
		"reduction": [
		    {
			"i": 0, "j": 1, "cut": ["crPRF", "Key^{00}"]
		    },
		    {
			"i": 0, "j": 2, "cut": ["PRF", "Key^{10}", "Key^{00}_2", "XOR"]
		    },
		    {
			"i": 0, "j": 3, "cut": ["crPRF", "Key^{11}"]
		    }
		]
	    }
	},

	"Lemma 3" :
	{
	    "longname": "Lemma 3 (\\(\\mathsf{CORE_{GNKDF}}\\))",
	    "parent": "Theorems",
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs": [["CORE^0_{NKDF}", "CORE^1_{NKDF}", "CORE^2_{NKDF}", "CORE^3_{NKDF}"]]
		}
	    ],
	    "type":
	    {
		"reduction": [
		    {
			"i": 0, "j": 1, "cut": ["XOR", "PRF", "Key^{00}_3", "Key^{00}"]
		    },
		    {
			"i": 0, "j": 2, "cut": ["XTR", "Sample", "Key^{00}_1"]
		    },
		    {
			"i": 0, "j": 3, "cut": ["XOR", "PRF", "Key^{00}_3", "Key^{10}_2"]
		    }
		]
	    }
	},

	"Lemma 4" :
	{
	    "longname": "Lemma 4 (\\(\\mathsf{CORE_{GNKDF}}\\))",
	    "parent": "Lemma 3",
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs":[["CORE^0_{crNKDF}","CORE^1_{crNKDF}","CORE^2_{crNKDF}","CORE^3_{crNKDF}"]]
		}

	    ],
	    "type":
	    {
		"reduction": [
		    {
			"i": 0, "j": 1, "cut": ["crPRF", "Key^{00}"]
		    },
		    {
			"i": 0, "j": 2, "cut": ["XTR", "Sample", "Key^{00}_1", "PRF", "XOR", "Key^{00}_2", "Key^{00}_3"]
		    },
		    {
			"i": 0, "j": 3, "cut": ["crPRF", "Key^{11}"]
		    }
		]
	    }
	},

	"Lemma 5" :
	{
	    "longname": "Lemma 5 (\\(\\mathsf{CORE_{GDHNKDF}}\\))",
	    "parent": "Theorems",
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs":[["CORE^0_{DHNKDF}","CORE^1_{DHNKDF}","CORE^2_{DHNKDF}","CORE^3_{DHNKDF}"]]
		}
	    ],
	    "type":
	    {
		"reduction": [
		    {
			"i": 0, "j": 1, "cut": ["XOR", "PRF", "Key^{00}_3", "Key^{00}"]
		    },
		    {
			"i": 0, "j": 2, "cut": ["DH", "XTR", "PKey", "Key^{00}_1"]
		    },
		    {
			"i": 0, "j": 3, "cut": ["XOR", "PRF", "Key^{00}_3", "Key^{10}_2"]
		    }
		]
	    }
	},

	"Lemma 6" :
	{
	    "longname": "Lemma 6 (\\(\\mathsf{CORE_{GcrDHNKDF}}\\))",
	    "parent": "Lemma 5",
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs":[["CORE^0_{crDHNKDF}","CORE^1_{crDHNKDF}","CORE^2_{crDHNKDF}","CORE^3_{crDHNKDF}"]]
		}
	    ],
	    "type":
	    {
		"reduction": [
		    {
			"i": 0, "j": 1, "cut": ["crPRF", "Key^{00}"]
		    },
		    {
			"i": 0, "j": 2, "cut": ["PKey", "DH", "XTR", "PRF", "XOR", "Key^{00}_1", "Key^{00}_2", "Key^{00}_3"]
		    },
		    {
			"i": 0, "j": 3, "cut": ["crPRF", "Key^{11}"]
		    }
		]
	    }
	}


    },

    "panel_widths": {"proof_width": "70%", "oracle_width": "27%"},
    "window_dimensions": {"width": 400, "height": 600}
}
