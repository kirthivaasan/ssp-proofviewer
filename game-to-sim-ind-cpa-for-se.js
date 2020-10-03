function driver() {
    var proof_name = "Game-based security and simulation-based security equivalence of IND-CPA for symmetric encryption";

    var monolithic_pkgs = {
	"Enc^0":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": ""
		}
	    }
	},

	"Enc^1":
	{
	    "oracles":
	    {
		"ENC" :
		{
		    "code": ""
		}
	    }
	},

	"Key":
	{
	    "oracles":
	    {
		"GET" :
		{
		    // "code": "\text{assert} k \\neq \\bot; k = {0, 1)"
		    "code": "a^2 + b^2; k = 0^\\lambda"
		},

		"SAMPLE" :
		{
		    "code": ""
		}

	    }

	},


	"Zeroer":
	{
	    "oracles":
	    {
		"ENC" :
		{
		    "code": ""
		}
	    }
	},


	"Sim":
	{
	    "oracles":
	    {
		"ENC" :
		{
		    "code": ""
		}
	    }
	},


	"Ideal":
	{
	    "oracles":
	    {
		"ENC":
		{
		    "code": ""
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
	    }
	},

	"Gind-cpa^1":
	{
	    "oracles": [["Key", "SAMPLE"], ["Enc^1", "ENC"]],
	    "graph":
	    {
		"Enc^1": [["Key", "GET"]],
		"Key": []
	    }
	}


    };

    var prooftree = {
	"Theorem" :
	{
	    "parent": null,
	    "text": [],
	    "graphs": [["Gind-cpa^0", "Gind-cpa^1", "Gind-cpa^1"]]
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
    add_proof(proof, wnd_pos);
}

driver();
