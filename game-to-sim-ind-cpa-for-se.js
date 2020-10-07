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
		    "code": "",
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
		    "code": "",
		    "params": ["\\ell"]
		}
	    }
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


	"Gind-cpa-Dropper-Enc-Zeroes":
	{
	    "oracles": [["Keys", "SAMPLE"], ["Dropper", "ENC"]],
	    "graph":
	    {
		"Keys": [],
		"Dropper": [["Enc-Zeroes", "ENC"]],
		"Enc-Zeroes": [["Keys", "GET"]]
	    },

	    "layout":
	    {
"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":90},"Keys":{"x":240,"y":0,"width":90,"height":40},"Dropper":{"x":50,"y":50,"width":50,"height":40},"Enc-Zeroes":{"x":140,"y":50,"width":70,"height":40}},"edges":{"@oracles_interface":{"Keys":"exitX=1;exitY=0.2;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;","Dropper":"exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},"Dropper":{"Enc-Zeroes":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"},"Enc-Zeroes":{"Keys":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.8;entryDx=0;entryDy=0;"}}
	    }
	}

    };

    var prooftree = {
	"Theorem" :
	{
	    "parent": null,
	    "contents": [
		{
		    "text": "Game-based \\(\\mathsf{IND\\text{-}CPA}\\) (<a href=\"ind-cpa-def.html\">IND-CPA</a>) for symmetric encryption security (indistinguishability between \\(\\mathsf{Gind\\text{-}cpa^0}\\) and \\(\\mathsf{Gind\\text{-}cpa^1}\\)) is equivalent to simulation-based \\(\\mathsf{IND\\text{-}CPA}\\) for symmetric encryption (indistinguishability between \\(\\mathsf{Gind\\text{-}cpa^0}\\) and \\(\\mathsf{Gind\\text{-}cpa^{sim}}\\)."
		},
		{
		    "graphs": [["Gind-cpa^0", "Gind-cpa^1"]]
		},
		{
		    "text": "Setup for simulation-based \\(\\mathsf{IND\\text{-}CPA}\\) ≅ \\(\\mathsf{Gind\\text{-}cpa^{sim}}\\)."
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
		    "text": "We show that indistinguishability of \\(\\mathsf{Gind\\text{-}cpa^0}\\) and \\(\\mathsf{Gind\\text{-}cpa^1}\\) implies indistinguishability between \\(\\mathsf{Gind\\text{-}cpa^0}\\) and \\(\\mathsf{Gind\\text{-}cpa^{sim}}\\)."
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
		    "text": "We show that indistinguishability between \\(\\mathsf{Gind\\text{-}cpa^0}\\) and \\(\\mathsf{Gind\\text{-}cpa^{sim}}\\) implies indistinguishability between \\(\\mathsf{Gind\\text{-}cpa^0}\\) and \\(\\mathsf{Gind\\text{-}cpa^1}\\)."
		},
		{
		    "graphs": [[]]
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
		    "ENC" :
		    {
			"code": "@assert k \\neq @bot;c @sample enc_k(0^\\ell);@return c;",
			"params": ["m"]
		    },

		    "ENC1" :
		    {
			"code": "@assert k \\neq @bot;c @sample enc_k(0^\\ell);@return c;",
			"params": ["m"]
		    },

		    "ENC2" :
		    {
			"code": "@assert k \\neq @bot;c @sample enc_k(0^\\ell);@return c;",
			"params": ["m"]
		    },

		    "ENC3" :
		    {
			"code": "@assert k \\neq @bot; ; ;c @sample enc_k(0^\\ell);@return c;",
			"params": ["m"]
		    },

		    "ENC4" :
		    {
			"code": "@assert k \\neq @bot;c @sample enc_k(0^\\ell);@return c;",
			"params": ["m"]
		    },

		    "ENC5" :
		    {
			"code": "@assert k \\neq @bot;c @sample enc_k(0^\\ell);@return c;",
			"params": ["m"]
		    },

		    "ENC6" :
		    {
			"code": "@assert k \\neq @bot;c @sample enc_k(0^\\ell);@return c;",
			"params": ["m"]
		    },

		    "ENC7" :
		    {
			"code": "@assert k \\neq @bot;c @sample enc_k(0^\\ell);@return c;",
			"params": ["m"]
		    },

		    "ENC8" :
		    {
			"code": "@assert k \\neq @bot;c @sample enc_k(0^\\ell);@return c;",
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
		    "text": "Code equivalence of Gind-cpa-Dropper-EncZeroes and \\(\\mathsf{Gind\\text{-}cpa^{sim}}\\)."
		},
		{
		    "graphs": [[]]
		}
	    ]
	},

	"Claim3":
	{
	    "parent": "LemDir2",
	    "contents": [
		{
		    "text": "Code equivalence"
		}
	    ]
	},

	"Claim4":
	{
	    "parent": "LemDir2",
	    "contents": [
		{
		    "text": "Reduction"
		}
	    ]
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
