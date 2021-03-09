data = {
    "name": "OWF definition",
    "monolithic_pkgs":
    {
	"Owf^0_f":
	{
	    "oracles":
	    {
		"SAMPLE":
		{
		    "code": "@assert y = @bot; x @sample \\{0, 1\\}^\\lambda; y @gets f(x); @return y",
		    "params": []
		},

		"CHECK":
		{
		    "code": "@if |x| @neq \\lambda @then; @> @return 0; y' @gets f(x); @if y = y' @then; @> @return 1; @else; @> @return 0",
		    "params": ["x"]
		}

	    }
	},

	"Owf^1_f":
	{
	    "oracles":
	    {
		"SAMPLE":
		{
		    "code": "@assert y = @bot; x @sample \\{0, 1\\}^\\lambda; y @gets f(x); @return y",
		    "params": []
		},

		"CHECK":
		{
		    "code": "@return 0",
		    "params": ["x"]
		}

	    }
	},



    },

    "modular_pkgs":
    {
	"Gowf^0_f":
	{
	    "oracles": [["Owf^0_f", "SAMPLE"], ["Owf^0_f", "CHECK"]],
	    "graph":
	    {
		"Owf^0_f": []
	    },

	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":40},"Owf^0_f":{"x":70,"y":0,"width":90,"height":40}},"edges":{"@oracles_interface":{"Owf^0_f":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"}}
	    }

	},

	"Gowf^1_f":
	{
	    "oracles": [["Owf^1_f", "SAMPLE"], ["Owf^1_f", "CHECK"]],
	    "graph":
	    {
		"Owf^1_f": []
	    },

	    "layout":
	    {
		"nodes":{"@oracles_interface":{"x":0,"y":0,"width":10,"height":40},"Owf^1_f":{"x":70,"y":0,"width":90,"height":40}},"edges":{"@oracles_interface":{"Owf^1_f":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryPerimeter=1;"}}
	    }
	}


    },

    "prooftree":
    {
	"Def" :
	{
	    "parent": null,
	    "contents": [
		{
		    "text": ""
		},
		{
		    "graphs": [["Gowf^0_f", "Gowf^1_f"]]
		}

	    ]

	}

    }

    "panel_sizes" = {"proof_width": "51%", "oracle_width": "30%"}
}
