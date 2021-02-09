function driver() {
    var proof_name = "Game-based security and simulation-based security equivalence of IND-CPA for symmetric encryption";

    var monolithic_pkgs = {
	"Enc":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": "k @gets GET(); c @sample enc_k(m); @return c",
		    "params": ["m"],
		}
	    }
	},

	"Enc^1":
	{
	    "oracles":
	    {
		"ENC" :
		{
		    "code": "k @gets GET(); c @sample enc_k(0^{|m|}); @return c",
		    "params": ["m"]
		}
	    }
	},

	"Key":
	{
	    "oracles":
	    {
		"SAMPLE" :
		{
		    "code": "@assert k = @bot;k @sample \\{0,1\\}^\\lambda;",
		    "params": []
		},

		"GET" :
		{
		    "code": "@assert k \\neq @bot;@return k;",
		    "params": []
		}
	    }

	},


	"Sim":
	{
	    "oracles":
	    {
		"ENC" :
		{
		    "code": "@assert k \\neq @bot;c @sample enc_k(0^\\ell);@return c;",
		    "params": ["\\ell"]
		}
	    }
	},


	"Ideal":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": "c @gets ENC(|m|);@return c;",
		    "params": ["m"]
		}
	    }
	},


	"Dropper":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": "c @gets ENC(|m|);@return c;",
		    "params": ["m"]
		}
	    }
	},

	"Zeroer":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": "m' @gets 0^{|m|};c @gets ENC(m');@return c",
		    "params": ["m"]
		}
	    }
	},

	"Enc-Zeroes":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": "k @gets GET(); c @gets enc_k(0^{\\ell});@return c",
		    "params": ["\\ell"]
		}
	    }
	},

	"Sim*": // "black box" package used for reasoning
	{
	    "oracles": {}
	}


    };

    var modular_pkgs = {
	"Genc^0":
	{
	    "oracles": [["Enc", "ENC"]],
	    "graph":
	    {
		"Enc": [["Key", "GET"]],
		"Key": []
	    },

	    "layout":
	    {
			"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":40},
					 "Enc":{"x":90,"y":0,"width":90,"height":40},
					 "Key":{"x":240,"y":0,"width":90,"height":40}},
			"edges":{"@oracles_interface":{"Key":"exitX=1;exitY=0.5;entryX=0;entryY=0.4;exitDx=0;exitDy=0;entryDx=0;entryDy=0;",
										   "Enc":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},
					 "Enc":{"Key":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.2;entryY=0.5;entryDx=0;entryDy=0;"}}
	    }
	},

	"Genc^1":
		{
		"oracles": [["Zeroer", "ENC"]],
	    "graph":
	    {
		"Key": [],
		"Zeroer": [["Enc", "ENC"]],
		"Enc": [["Key", "GET"]]
	    },

	    "layout":
	    {
			"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":40},
					 "Key":{"x":240,"y":0,"width":90,"height":40},
					 "Zeroer":{"x":50,"y":0,"width":50,"height":40},
					 "Enc":{"x":140,"y":0,"width":70,"height":40}},
			"edges":{"@oracles_interface":{"Key":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Zeroer":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},
					 "Zeroer":{"Enc":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},
					 "Enc":{"Key":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"}}
	    }
	},

	"Hybrid-Claim-1":
		{
		"oracles": [["Zeroer", "ENC"]],
	    "graph":
	    {
		"Key": [],
		"Zeroer": [["Enc", "ENC"]],
		"Enc": [["Key", "GET"]]
	    },

	    "layout":
	    {
			"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":40},
					 "Key":{"x":240,"y":0,"width":90,"height":40},
					 "Zeroer":{"x":50,"y":0,"width":50,"height":40},
					 "Enc":{"x":140,"y":0,"width":70,"height":40}},
			"edges":{"@oracles_interface":{"Zeroer":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},
					 "Zeroer":{"Enc":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},
					 "Enc":{"Key":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"}}
	    }
	},

	"Genc(Sim)":
	{
	    "oracles": [["Zeroer", "ENC"]],
	    "graph":
	    {
		"Zeroer": [["Sim", "ENC"]],
		"Sim": []
	    },

	    "layout":
	    {
			"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":40},
					 "Zeroer":{"x":50,"y":0,"width":50,"height":40},
					 "Sim":{"x":140,"y":0,"width":190,"height":40}},
			"edges":{"@oracles_interface":{"Sim":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;",
										   "Zeroer":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},
					 "Zeroer":{"Sim":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"}}
	    }
	},

	"Hybrid-Lemma-1":
	{
	    "oracles": [["Zeroer ", "ENC"]],
	    "graph":
	    {
			"Zeroer": [["Sim", "ENC"]],
			"Zeroer ": [["Zeroer", "ENC"]],
			"Sim": []
	    },

	    "layout":
	    {
			"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":40},
					 "Zeroer":{"x":150,"y":0,"width":50,"height":40},
					 "Zeroer ":{"x":50,"y":0,"width":50,"height":40},
					 "Sim":{"x":240,"y":0,"width":190,"height":40}},
			"edges":{"@oracles_interface":{"Sim":    "exitX=1;exitY=0.5;entryX=0;entryY=0.2;exitDx=0;exitDy=0;entryDx=0;entryDy=0;",
										   "Zeroer ":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;exitDx=0;entryPerimeter=1;exitDy=0;entryDx=0;entryDy=0;"},
					 "Zeroer":            {"Sim":   "exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"},
					 "Zeroer ":           {"Zeroer":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"}}
	    }
	},

		
	"Genc(Sim_{Lemma2})":
	{
	    "oracles": [["Zeroer", "ENC"]],
	    "graph":
	    {
		"Zeroer": [["Sim_{Lemma2}", "ENC"]],
		"Sim_{Lemma2}": []
	    },

	    "layout":
	    {
			"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":40},
					 "Zeroer":{"x":50,"y":0,"width":50,"height":40},
					 "Sim_{Lemma2}":{"x":140,"y":0,"width":190,"height":40}},
			"edges":{"@oracles_interface":{"Sim_{Lemma2}":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;exitDx=0;exitDy=0;entryDx=0;entryDy=0;",
										   "Zeroer":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},
					 "Zeroer":{"Sim_{Lemma2}":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"}}
	    }
	},

	"Sim_{Lemma2}":
	{
		"oracles": [["Enc", "ENC"]],
	    "graph":
	    {
		"Key": [],
		"Enc": [["Key", "GET"]]
	    },

	    "layout":
	    {
			"nodes":{"@oracles_interface":{"x":-20,"y":0,"width":10,"height":40},
					 "Key":{"x":140,"y":0,"width":90,"height":40},
					 "Enc":{"x":40,"y":0,"width":70,"height":40}},
			"edges":{"@oracles_interface":{"Enc":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},
					 "Enc":{"Key":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"}}
	    }
	},

	"Zeroer-Zeroer":
	{
		"oracles": [["Zeroer", "ENC"]],
	    "graph":
	    {
		"Zeroer ": [],
		"Zeroer": [["Zeroer ", "ENC"]]
	    },

	    "layout":
	    {
			"nodes":{"@oracles_interface":{"x":-20,"y":0,"width":10,"height":40},
					 "Zeroer ":{"x":140,"y":0,"width":90,"height":40},
					 "Zeroer":{"x":40,"y":0,"width":70,"height":40}},
			"edges":{"@oracles_interface":{"Zeroer":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},
					 "Zeroer":{"Zeroer ":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"}}
	    }
	},

	
    };

    var prooftree = {
	"Theorem" :
	{
	    "parent": null,
	    "contents": [
		{
		    "text": "<a href=\"ind-cpa-def.html\">IND-CPA security</a> of ENC and simulation-based security of ENC are equivalent, i.e., there exists a PPT simulator \\(\\mathsf{Sim}\\) such that for all PPT adversaries A, \\(Adv(A,Genc^0,Genc(sim)) \\leq 2\\cdot Adv(A,Genc^0,Genc^1)\\) and conversely, for all PPT simulators Sim and PPT adversaries A, \\(Adv(A, Genc^0, Genc^1) \\leq Adv(A, Genc^0, Genc(Sim))\\)"
		},
		// {
		//     "text": "Recall that the game-base notion of \\(\\mathsf{IND\\text{-}CPA}\\) states that \\(\\mathsf{Gind\\text{-}cpa^0}\\) ≅ \\(\\mathsf{Gind\\text{-}cpa^1}\\)"
		// },
		// {
		//     "graphs": [["Genc^0", "Genc^1"]]
		// },
		// {
		//     "text": "We define simulation-based \\(\\mathsf{IND\\text{-}CPA}\\) as \\(\\mathsf{Gind\\text{-}cpa^0}\\) ≅ \\(\\mathsf{Gind\\text{-}cpa^{sim}}\\) (for all PPT adversaries)."
		// },

		// {
		//     "graphs": [["Genc^0", "Genc(Sim)"]]
		// },
		{
			"text": "<p class=\"proofstep-title\">Proof of Theorem</p><p>We now first state the two lemmas which constitute the theorem separately and then first prove Lemma 1 and then Lemma 2. Jumping ahead, we note that in the proof of Lemma 1, we use the ... assumption twice, while in the proof of Lemma ..., we use the ... assumption only once.</p>"
		}
	    ]
	},

	"Lemma 1:\nSimulation-based security of \\(\\mathsf{se}\\) implies IND-CPA security" :
	{
	    "parent": "Theorem",
	    "contents": [
		{
		    "text": "Simulation-based security of ENC implies the <a href=\"ind-cpa-def.html\">IND-CPA security</a> of ENC , i.e., for all PPT simulators Sim and PPT adversaries A, \\(Adv(A, Genc^0, Genc^1) \\leq Adv(A, Genc^0, Genc(Sim))\\)"
		},
	    ]
	},

	"Lemma 2:\nIND-CPA security of \\(\\mathsf{se}\\) implies simulation-based security" :
	{
	    "parent": "Theorem",
	    "contents": [
		{
		    "text": "<a href=\"ind-cpa-def.html\">IND-CPA security</a> of ENC implies the simulation-based security of ENC, i.e., there exists a PPT simulator \\(\\mathsf{Sim}_{Lemma2}\\) such that for all PPT adversaries \\(\\mathcal{A}\\), \\(Adv(A,Genc^0,Genc(\\mathsf{Sim}_{Lemma2})) = Adv(A,Genc^0,Genc^1)\\), where \\(\\mathsf{Sim}_{Lemma2}\\) is defined as follows:"
		},
		{
		    "graphs": [["Sim_{Lemma2}"]]
		},
		{
			"text": "<p class=\"proofstep-title\">Proof of Lemma 2</p>"
		},
		{
			"text":`Claim 1 establishes that \\(\\mathsf{Genc}(\\mathsf{Sim_{Lemma2}})\\) is code-equivalent to \\(\\mathsf{Genc}^1\\). We then directly obtain Lemma 2 as follows. Let \\(\\mathcal{A}\\) be a PPT adversary. Then,
$$\\begin{align}
  \\mathsf{Adv}(\\mathcal{A},\\mathsf{Genc}^0,\\mathsf{Genc}(\\mathsf{Sim_{Lemma2}})) \\stackrel{\\text{def}}{=}
  &|\\text{Pr}[1=\\mathcal{A}\\rightarrow \\mathsf{Genc}^0]-
   \\text{Pr}[1=\\mathcal{A}\\rightarrow \\mathsf{Genc}(\\mathsf{Sim_{Lemma2}})]|\\\\
=&|\\text{Pr}[1=\\mathcal{A}\\rightarrow \\mathsf{Genc}^0]-
   \\text{Pr}[1=\\mathcal{A}\\rightarrow \\mathsf{Genc}^1]|\\\\
\\stackrel{\\text{def}}{=}& \\mathsf{Adv}(\\mathcal{A},\\mathsf{Genc}^0,\\mathsf{Genc}^1)\\\\
\\end{align}$$`
		},
	    ]
	},

	"Claim 1:\nEquivalence": {
		"parent": "Lemma 2:\nIND-CPA security of \\(\\mathsf{se}\\) implies simulation-based security",
		"contents": [
		{
			"text": "\\(\\mathsf{Genc}^1\\stackrel{code}{\\equiv}\\mathsf{Genc}(\\mathsf{Sim}_{Lemma2})\\)"
		},
		{
			"text": "<p class=\"proofstep-title\">Proof of Claim 1</p><p>Below we plug in the definition of \\(\\mathsf{Sim}_{Lemma2}\\) to obtain \\(\\mathsf{Hybrid\\text{-}Claim\\text{-}1}\\) from \\(\\mathsf{Genc(Sim_{Lemma2})}\\). Removing the dashed line yields \\(\\mathsf{Genc^1}\\).</p>"
		},
		{
		    "graphs": [["Genc(Sim_{Lemma2})"], ["Hybrid-Claim-1"], ["Genc^1"], ]
		},
		{
			"text": "<p class=\"proofstep-title\">Proof of Lemma 1</p>"
		},
		{
			"text": `Claim 2 bounds the advantage \\(\\mathsf{Adv}(\\mathcal{A},\\mathsf{Genc}^1,\\mathsf{Hybrid\\text{-}Lemma1})\\leq  \\mathsf{Adv}(\\mathcal{A},\\mathsf{Genc}^0,\\mathsf{Genc}(\\mathsf{Sim})) \\) via reduction to the assumption. Claim 3 then establishes that game \\(\\mathsf{Hybrid\\text{-}Lemma1}\\) is equal to \\(\\mathsf{Genc(Sim)}\\) by showing that \\(\\mathsf{Zeroer}\\rightarrow \\mathsf{Zeroer} \\stackrel{\\text{code}}{\\equiv}\\mathsf{Zeroer}\\). The lemma then follows via the triangle inequality:
$$\\begin{align}
\\mathsf{Adv}(\\mathcal{A},\\mathsf{Genc}^1,\\mathsf{Genc}^0)\\leq& \\mathsf{Adv}(\\mathcal{A},\\mathsf{Genc}^1,\\mathsf{Hybrid\\text{-}Lemma1}) \\\\
&+\\mathsf{Adv}(\\mathcal{A},\\mathsf{Genc}^0,\\mathsf{Genc}(\\mathsf{Sim}))\\\\
\\leq& 2\\cdot \\mathsf{Adv}(\\mathcal{A},\\mathsf{Genc}^0,\\mathsf{Genc}(\\mathsf{Sim}))
\\end{align}$$`
		},
		{
		    "graphs": [["Genc^1"], ["Hybrid-Lemma-1"], ["Genc(Sim)"], ["Genc^0"]]
		},
		],
	    "type":
	    {
			"plugin": {
				"graph":"Hybrid-Claim-1",
				"cut": ["Enc", "Key"]
			}
		}
	},

	"Claim 2:\n Indistinguishability between \\(\\mathsf{Genc}\\) and \\(\\mathsf{Hybrid\\text{-}Lemma\\text{-}1}\\)": {
		"parent": "Lemma 1:\nSimulation-based security of \\(\\mathsf{se}\\) implies IND-CPA security",
		"contents": [
		{
			"text": "."
		},
		]
	},

	"Claim 3: Equivalence": {
		"parent": "Lemma 1:\nSimulation-based security of \\(\\mathsf{se}\\) implies IND-CPA security",
		"contents": [
		{
			"text": "\\(\\mathsf{Zeroer}\\rightarrow \\mathsf{Zeroer} \\stackrel{\\text{code}}{\\equiv}\\mathsf{Zeroer}\\)"
		},
		{
			"text": "<p class=\"proofstep-title\">Proof of Claim 3</p>"
		},
		{
		    "graphs": [["Zeroer-Zeroer"]]
		},
		],
		"type":
		{
			"codeq": {
				"oracles": {
					"Zeroer.ENC\\rightarrow Zeroer.ENC": {
						"code": "m' @gets 0^{|m|};m'' @gets 0^{|m'|};c @gets ENC(m'');@return c",
						"params": ["m"]
					},
					"Zeroer.ENC": {
						"code": "m'' @gets 0^{|m|};;c @gets ENC(m'');@return c",
						"params": ["m"]
					}

				},
				"graph": "Zeroer-Zeroer",
				"packages": ["Zeroer"]
			}
		},
	},


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

var game_to_sim_notion_se_proof = driver();
