function nprfs_mls_driver() {
    var proof_name = "GGM construction (PRG implies PRF)";

    var monolithic_pkgs = {
	"Key":
	{
	    "state": ["k"],
	    "oracles":
	    {
		"Set" :
		{
		    "params": ["idx", "k", "hon"],
		    "code": "@if Q[idx],H[idx] = k,hon :;@> @return (); @assert Q[idx] = \\bot; Q[idx] @gets k; H[idx] @gets hon; @if b_{\\mathsf{Ind}} \\wedge H[idx]: K[idx] @sample \\{0,1\\}^{|k|}; else : K[idx] @gets k;"
		},
		"Get" :
		{
		    "params": ["idx"],
		    "code": ""
		}

	    }
	}
    };


    var modular_pkgs = {


    };

    var game_defs = {

    };

    var prooftree = {

    };

    var proof = {
	"name": proof_name,
	"prooftree": prooftree,
	"game_defs": game_defs,
	"monolithic_pkgs": monolithic_pkgs,
	"modular_pkgs": modular_pkgs
    }

    var wnd_width = 600;
    var wnd_height = 300;
    var wnd_x = (window.innerWidth - wnd_width) - wnd_width/9;
    var wnd_y = window.innerHeight - wnd_height;

    var wnd_pos = {wnd_height: 300, width: wnd_width, x: wnd_x, y: wnd_y}
    var wrapper_width = {proof_width: '65%', oracle_width: '30%'}
    add_proof(proof, wnd_pos, wrapper_width);


}

nprfs_mls_driver();
