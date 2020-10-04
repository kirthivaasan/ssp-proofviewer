function driver() {
    var proof_name = "Game-based security and simulation-based security equivalence of IND-CPA for symmetric encryption";

    var monolithic_pkgs = {
	"Enc^0":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": "k @gets KEY(); c @sample enc_k(m); @return c",
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
		    "code": "",
		    "params": ["m"]
		}
	    }
	},

	"Key":
	{
	    "oracles":
	    {
		"GET" :
		{
		    "code": "@assert k \\neq @bot;@return k;",
		    "params": []
		},

		"SAMPLE" :
		{
		    "code": "@if k= @bot @then;@> k @sample \\{0,1\\}^\\lambda;",
		    "params": []
		}

	    }

	},


	"Zeroer":
	{
	    "oracles":
	    {
		"ENC" :
		{
		    "code": "",
		    "params": ["m"]
		}
	    }
	},


	"Sim":
	{
	    "oracles":
	    {
		"ENC" :
		{
		    "code": "",
		    "params": ["m"]
		}
	    }
	},


	"Ideal":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": "",
		    "params": ["m"]
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
		"nodes":
		{
		    "@oracles_interface":{"x":80,"y":50,"width":30,"height":100},
		    "Enc^0":{"x":160,"y":110,"width":90,"height":40},
		    "Key":{"x":320,"y":60,"width":90,"height":40}
		},
		"edges":
		{
		    "@oracles_interface":
		    {
			"Key":"exitX=0.8;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;",
			"Enc^0":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"
		    },
		    "Enc^0":
		    {
			"Key":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.2;entryY=0.6;entryDx=0;entryDy=0;"
		    }
		}
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
		"nodes":
		{
		    "@oracles_interface":{"x":80,"y":50,"width":30,"height":100},
		    "Enc^1":{"x":160,"y":110,"width":90,"height":40},
		    "Key":{"x":320,"y":60,"width":90,"height":40}
		},
		"edges":
		{
		    "@oracles_interface":
		    {
			"Key":"exitX=0.8;exitY=0.4;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;",
			"Enc^1":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"
		    },
		    "Enc^1":
		    {
			"Key":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.2;entryY=0.6;entryDx=0;entryDy=0;"
		    }
		}
	    }
	}
    };

    var prooftree = {
	"Theorem" :
	{
	    "parent": null,
	    "text": [],
	    "graphs": [["Gind-cpa^0", "Gind-cpa^0", "Gind-cpa^0", "Gind-cpa^0"],
		       ["Gind-cpa^1", "Gind-cpa^1", "Gind-cpa^1"]]
	},

	"Lemma1" :
	{
	    "parent": "Theorem",
	    "text": [],
	    "graphs": [[]]
	},

	"Lemma2" :
	{
	    "parent": "Theorem",
	    "text": [],
	    "graphs": [[]]
	},

	"Lemma3" :
	{
	    "parent": "Lemma2",
	    "text": [],
	    "graphs": [[]]
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
