function yao_driver() {
    var test_proof_name = "Yao's Garbled Circuits";

    var test_prooftree = {"a" : {"parent": null},
			  "b" : {"parent": "a"},
			  "c" : {"parent": "a"},
			  "d" : {"parent": "c"},
			  "e" : {"parent": "d"}
			 };

    var pkg_defs = {"Enc":
		    {"oracle_specs":
		     [
			 {"name": "ENC",
			  "params": ["x"],
			  "code": "k <- GET();c <-$ f.enc(k, x);return c;"
			 }
		     ],
		     "params": null
		    },
		    "Prf": {"oracle_specs": [], "params": null},
		    "Key": {"oracle_specs": [], "params": null}
		   };

    add_proof_tree_window(test_proof_name, test_prooftree, 300, 300, 1600, 600);
}

yao_driver();
