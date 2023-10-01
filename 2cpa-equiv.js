function driver() {
    var proof_name = "2CPA and (standard) IND-CPA equivalence";

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
	}
    };

    var prooftree = {
	"ExplanationStepTemplate": {
	    "contents": [
		{
		    "text": ""
		}
	    ]
	},

	"Lemma": {
	    "parent": "ExplanationStepTemplate",
	    "contents": [
		{
		    "text": "Let \\(se\\) be a symmetric encryption scheme. For reduction \\(\\mathcal{R}_{cpa} := \\mathsf{RED}\\), it holds that for any PPT adversary \\(\\mathcal{A}\\), $$\\mathsf{Adv}(\\mathcal{A}; \\mathsf{2CPA}^0(se), \\mathsf{2CPA}^1(se)) \\leq \\mathsf{Adv}(\\mathcal{A} \\rightarrow \\mathcal{R}_{cpa}; \\mathsf{IND\\text{-}CPA}^0(se), \\mathsf{IND\\text{-}CPA}^1(se)).$$"
		},
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

    return proof;
}

var twocpa_proof = driver();
