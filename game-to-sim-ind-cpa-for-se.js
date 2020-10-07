function driver() {
    var proof_name = "Game-based security and simulation-based security equivalence of IND-CPA for symmetric encryption";

    var monolithic_pkgs = {
	"Enc^0":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": "k @gets GET(); c @sample enc_k(m); @return c",
		    "params": ["m"]
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
		    "code": "c @gets ENC(0^{|m|});@return c",
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
	"Gind-cpa^0":
	{
	    "oracles": [["Key", "SAMPLE"], ["Enc^0", "ENC"]],
	    "graph":
	    {
		"Enc^0": [["Key", "GET"]],
		"Key": []
	    },

	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":90},"Enc^0":{"x":90,"y":50,"width":90,"height":40},"Key":{"x":240,"y":0,"width":90,"height":40}},"edges":{"@oracles_interface":{"Key":"exitX=1;exitY=0.2;entryX=0;entryY=0.4;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Enc^0":"exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"Enc^0":{"Key":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.2;entryY=0.6;entryDx=0;entryDy=0;"}}
	    }
	},

	"Gind-cpa^1":
	{
	    "oracles": [["Key", "SAMPLE"], ["Enc^1", "ENC"]],
	    "graph":
	    {
		"Enc^1": [["Key", "GET"]],
		"Key": []
	    },

	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":90},"Enc^1":{"x":90,"y":50,"width":90,"height":40},"Key":{"x":240,"y":0,"width":90,"height":40}},"edges":{"@oracles_interface":{"Key":"exitX=1;exitY=0.2;entryX=0;entryY=0.4;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Enc^1":"exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"Enc^1":{"Key":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.2;entryY=0.6;entryDx=0;entryDy=0;"}}
	    }
	},

	"Gind-cpa-sim":
	{
	    "oracles": [["Sim", "SAMPLE"], ["Ideal", "ENC"]],
	    "graph":
	    {
		"Ideal": [["Sim", "ENC"]],
		"Sim": []
	    },

	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":90},"Ideal":{"x":150,"y":50,"width":50,"height":40},"Sim":{"x":240,"y":0,"width":90,"height":90}},"edges":{"@oracles_interface":{"Sim":"exitX=1;exitY=0.2;entryX=0;entryY=0.2;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Ideal":"exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"Ideal":{"Sim":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.8;entryDx=0;entryDy=0;"}}
	    }
	},

	"Gind-cpa-sim*":
	{
	    "oracles": [["Sim*", "SAMPLE"], ["Ideal", "ENC"]],
	    "graph":
	    {
		"Ideal": [["Sim*", "ENC"]],
		"Sim*": []
	    },

	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":90},"Ideal":{"x":150,"y":50,"width":50,"height":40},"Sim*":{"x":240,"y":0,"width":90,"height":90}},"edges":{"@oracles_interface":{"Sim*":"exitX=1;exitY=0.2;entryX=0;entryY=0.2;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Ideal":"exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"Ideal":{"Sim*":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.8;entryDx=0;entryDy=0;"}}
	    }
	},


	"Gind-cpa-Dropper-Enc-Zeroes":
	{
	    "oracles": [["Key", "SAMPLE"], ["Dropper", "ENC"]],
	    "graph":
	    {
		"Key": [],
		"Dropper": [["Enc-Zeroes", "ENC"]],
		"Enc-Zeroes": [["Key", "GET"]]
	    },

	    "layout":
	    {
"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":90},"Key":{"x":240,"y":0,"width":90,"height":40},"Dropper":{"x":50,"y":50,"width":50,"height":40},"Enc-Zeroes":{"x":140,"y":50,"width":70,"height":40}},"edges":{"@oracles_interface":{"Key":"exitX=1;exitY=0.2;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Dropper":"exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"Dropper":{"Enc-Zeroes":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Enc-Zeroes":{"Key":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.8;entryDx=0;entryDy=0;"}}
	    }
	},

	"Gind-cpa-Zeroer-Ideal-sim*":
	{
	    "oracles": [["Sim*", "SAMPLE"], ["Zeroer", "ENC"]],
	    "graph":
	    {
		"Zeroer": [["Ideal", "ENC"]],
		"Ideal": [["Sim*", "ENC"]],
		"Sim*": []
	    },

	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":90},"Zeroer":{"x":50,"y":50,"width":60,"height":40},"Ideal":{"x":150,"y":50,"width":60,"height":40},"Sim*":{"x":250,"y":0,"width":90,"height":90}},"edges":{"@oracles_interface":{"Sim*":"exitX=1;exitY=0.2;entryX=0;entryY=0.2;exitDx=0;exitDy=0;entryDx=0;entryDy=0;","Zeroer":"exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"Zeroer":{"Ideal":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Ideal":{"Sim*":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.6;entryDx=0;entryDy=0;"}}
	    }
	}

    };

    var prooftree = {
	"Theorem" :
	{
	    "parent": null,
	    "contents": [
		{
		    "text": "Game-based \\(\\mathsf{IND\\text{-}CPA}\\) (<a href=\"ind-cpa-def.html\">IND-CPA</a>) (for symmetric encryption security) is equivalent to simulation-based security notion."
		},
		{
		    "text": "Recall that the game-base notion of \\(\\mathsf{IND\\text{-}CPA}\\) states that \\(\\mathsf{Gind\\text{-}cpa^0}\\) ≅ \\(\\mathsf{Gind\\text{-}cpa^1}\\)"
		},
		{
		    "graphs": [["Gind-cpa^0", "Gind-cpa^1"]]
		},
		{
		    "text": "We define simulation-based \\(\\mathsf{IND\\text{-}CPA}\\) as \\(\\mathsf{Gind\\text{-}cpa^0}\\) ≅ \\(\\mathsf{Gind\\text{-}cpa^{sim}}\\) (for all PPT adversaries)."
		},

		{
		    "graphs": [["Gind-cpa^0", "Gind-cpa-sim"]]
		}
	    ]
	},

	"LemDir1" :
	{
	    "parent": "Theorem",
	    "contents": [
		{
		    "text": "We show that \\(\\mathsf{Gind\\text{-}cpa^0}\\) ≅ \\(\\mathsf{Gind\\text{-}cpa^1}\\) implies \\(\\mathsf{Gind\\text{-}cpa^0}\\) ≅ \\(\\mathsf{Gind\\text{-}cpa^{sim}}\\) (with construction of a simulator (package) \\(\\mathsf{Sim}\\))."
		},
		{
		    "graphs": [[]]
		}
	    ]
	},

	"LemDir2" :
	{
	    "parent": "Theorem",
	    "contents": [
		{
		    "text": "We show that assuming \\(\\mathsf{Gind\\text{-}cpa^0}\\) ≅ \\(\\mathsf{Gind\\text{-}cpa^{sim*}}\\) (for some simulator \\(\\mathsf{sim*}\\)) implies \\(\\mathsf{Gind\\text{-}cpa^0}\\) ≅ \\(\\mathsf{Gind\\text{-}cpa^1}\\)."
		},
		{
		    "text": "The definition of \\(\\mathsf{Gind\\text{-}cpa\\text{-}sim*}\\) is not very different from \\(\\mathsf{Gind\\text{-}cpa^{sim*}}\\). The only difference is that the \\(\\mathsf{Sim*}\\) package is <em>black-box</em>, that is, there is no explicit definition for oracles contained within this package - we assume that such a package exists for the sake of reasoning."
		},
		{
		    "graphs": [["Gind-cpa-sim*"]]
		}

	    ]
	},

	"Claim1" :
	{
	    "parent": "LemDir1",
	    "contents": [
		{
		    "text": "The games \\(\\mathsf{Gind\\text{-}cpa^1}\\) and \\(\\mathsf{Gind\\text{-}cpa\\text{-}Dropper\\text{-}EncZeroes}\\) are code equivalent."
		},
		{
		    "graphs": [["Gind-cpa^1", "Gind-cpa-Dropper-Enc-Zeroes"]]
		}

	    ],
	    "type":
	    {
		"codeq": {
		    "Enc^1.ENC" :
		    {
			"code": "k @gets GET(); c @sample enc_k(0^{|m|}); @return c",
			"params": ["m"]
		    },

		    "ENC1" :
		    {
			"code": "k @gets GET(); c @sample enc_k(0^{|m|}); @return c",
			"params": ["m"]
		    },

		    "Dropper.ENC" :
		    {
			"code": "c @gets ENC(|m|); ;@return c;",
			"params": ["m"]
		    }


		}
	    }
	},

	"Claim2" :
	{
	    "parent": "LemDir1",
	    "contents": [
		{
		    "text": "Code equivalence of \\(\\mathsf{Gind\\text{-}cpa\\text{-}Dropper\\text{-}Enc\\text{-}Zeroes}\\) and \\(\\mathsf{Gind\\text{-}cpa^{sim}}\\)."
		},
		{
		    "graphs": [["Gind-cpa-Dropper-Enc-Zeroes", "Gind-cpa-sim"]]
		}
	    ]
	},

	"Claim3":
	{
	    "parent": "LemDir2",
	    "contents": [
		{
		    "text": "Code equivalence"
		},
		{
		    "graphs": [["Gind-cpa-sim*", "Gind-cpa-Zeroer-Ideal-sim*"]]
		}
	    ]
	},

	"Claim4":
	{
	    "parent": "LemDir2",
	    "contents": [
		{
		    "text": "Reduction"
		},
		{
		    "graphs": [["Gind-cpa-Zeroer-Ideal-sim*"]]
		}
	    ],
	    "type":
	    {
		"reduction":
		{
		    "graph": "Gind-cpa-Zeroer-Ideal-sim*",
		    "cut": ["Sim*", "Zeroer", "Ideal"]
		}
	    }

	},

	"Claim5":
	{
	    "parent": "LemDir2",
	    "contents": [
		{
		    "text": "Code equivalence"
		}
	    ]
	}

    };

    var proof = {
	"name": proof_name,
	"prooftree": prooftree,
	"monolithic_pkgs": monolithic_pkgs,
	"modular_pkgs": modular_pkgs
    }

    var wnd_pos = {height: 300, width: 300, x: 1600, y: 600}
    var wrapper_width = {proof_width: '51%', oracle_width: '30%'}
    add_proof(proof, wnd_pos, wrapper_width);
}

driver();
