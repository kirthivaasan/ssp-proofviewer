function driver() {
    var proof_name = "Game-based security and simulation-based security equivalence of IND-CPA for symmetric encryption";

    var monolithic_pkgs = {
        "Enc":
        {
            "oracles":
            {
                "ENC":
                {
                    "code": "k @gets \\mathsf{GET}(); c @sample \\mathsf{se}.\\mathsf{enc}(k,m); @return c",
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
                    "code": "k @gets \\mathsf{GET}(); c @sample enc_k(0^{|m|}); @return c",
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
                    "code": "\\mathbf{if} k = @bot : k @sample \\{0,1\\}^\\lambda;@return k;",
                    "params": []
                }
            }

        },



        "Ideal":
        {
            "oracles":
            {
                "ENC":
                {
                    "code": "c @gets \mathsf{ENC}(|m|);@return c;",
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
                    "code": "m' @gets 0^{|m|};c @gets \\mathsf{ENC}(m');@return c",
                    "params": ["m"]
                }
            }
        },

        "Zeroer_0":
        {
            "instance": "Zeroer"
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
            "oracles": [["Zeroer_0", "ENC"]],
            "graph":
            {
                "Zeroer_0": [["Zeroer", "ENC"]],
                "Zeroer": [["Sim", "ENC"]],
                "Sim": []
            },

            "layout":
            {
                "nodes":{"@oracles_interface":{"x":0,"y":0,"width":1,"height":40},
                         "Zeroer":{"x":150,"y":0,"width":50,"height":40},
                         "Zeroer_0":{"x":50,"y":0,"width":50,"height":40},
                         "Sim":{"x":240,"y":0,"width":190,"height":40}},
                "edges":{"@oracles_interface":{"Sim":    "exitX=1;exitY=0.5;entryX=0;entryY=0.2;exitDx=0;exitDy=0;entryDx=0;entryDy=0;",
                                               "Zeroer_0":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;exitDx=0;entryPerimeter=1;exitDy=0;entryDx=0;entryDy=0;"},
                         "Zeroer":            {"Sim":   "exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"},
                         "Zeroer_0":           {"Zeroer":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"}}
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
            "oracles": [["Zeroer_0", "ENC"]],
            "graph":
            {
                "Zeroer": [],
                "Zeroer_0": [["Zeroer", "ENC"]]
            },

            "layout":
            {
                "nodes":{"@oracles_interface":{"x":-20,"y":0,"width":10,"height":40},
                         "Zeroer":{"x":140,"y":0,"width":90,"height":40},
                         "Zeroer_0":{"x":40,"y":0,"width":70,"height":40}},
                "edges":{"@oracles_interface":{"Zeroer_0":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"},
                         "Zeroer_0":{"Zeroer":"exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"}}
            }
        },

        "Zeroer":
        {
            "oracles": [["Zeroer", "ENC"]],
            "graph":
            {
                "Zeroer": [],
            },

            "layout":
            {
                "nodes":{"@oracles_interface":{"x":0,"y":0,"width":2,"height":40},
                         "Zeroer":{"x":40,"y":0,"width":90,"height":40}},
                "edges":{"@oracles_interface":{"Zeroer":"exitX=1;exitY=0.5;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;"}}
            }
        }

    };

    var prooftree = {
		"Definitions":
		{
			parent: null,
			contents: [
                {
                    "text": `Based on the following games, we can can define two notions of security for symmetric key encryption schemes,`
                },
				{
					"graphs": [["Genc^0"], ["Genc^1", "Genc(Sim)"]]
				},
                {
                    "text": `
Where the distinguishing advantage is defined as
$$\\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^0,\\mathrm{Genc}^1)$$
While advantage against the simulator is defined as
$$\\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^0,\\mathrm{Genc}(\\mathrm{Sim}))$$
and we say an encryption scheme is IND-CPA secure if for any PPT adversary \\(\\mathcal{A}\\), the advantage is neglegible (resp. there exist a PPT simulator \\(\\mathrm{Sim}\\) such that the advantage is neglegible).
The \\(\\mathrm{Zeroer}\\) package here can be seen as <em>leackage</em> of the encryption, i.e. the <em>length</em> of the message is passed on to the simulator while all other information is removed (and thus hidden from the adversary).
One can, in fact, show that the two notions are equivalent:
`
                },

			]
		},
        "Theorem" :
        {
            "parent": null,
            "contents": [
                {
                    text: `There <em>exists</em> a PPT simulator \\(\\mathrm{Sim}\\)
such that for all PPT adversaries \\(\\mathcal{A}\\),
$$\\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^0,\\mathrm{Genc}(\\mathrm{Sim})) = \\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^0,\\mathrm{Genc}^1)$$
additionally, there exists a PPT reduction \\(\\mathrm{R}\\) such that for <em>all</em> PPT simulators \\(\\mathrm{Sim}\\) and PPT adversaries \\(\\mathcal{A}\\),
$$\\mathsf{Adv}(\\mathcal{A}, \\mathrm{Genc}^0, \\mathrm{Genc}^1) \\leq \\mathsf{Adv}(\\mathcal{A}\\rightarrow\\mathrm{R}, \\mathrm{Genc}^0, \\mathrm{Genc}(\\mathrm{Sim}))+\\mathrm{Adv}(\\mathcal{A}, \\mathrm{Genc}^0, \\mathrm{Genc}(\\mathrm{Sim})).$$
Loosely, there exist a simulator which precisely models the game based IND-CPA notion and this simulator is optimal up to a factor of two.
`
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
                    "text": "<p class=\"proofstep-title\">Proof of Theorem</p><p>We now first state the two lemmas which constitute the theorem separately and then first prove Lemma 1 and then Lemma 2.</p>"
                }
            ]
        },

        "Lemma 1" :
        {
            "longname": "Lemma 1:\nSimulation-based security of \\(\\mathsf{se}\\) implies IND-CPA security",
            "parent": "Theorem",
            "contents": [
                {
                    "text": "There exists a reduction \\(\\mathrm{R}\\), such that for all PPT simulators \\(\\mathrm{Sim}\\) and PPT adversaries \\(\\mathcal{A}\\), $$\\mathsf{Adv}(\\mathcal{A}, \\mathrm{Genc}^0, \\mathrm{Genc}^1) \\leq \\mathsf{Adv}(\\mathcal{A}\\rightarrow\\mathrm{R}, \\mathrm{Genc}^0, \\mathrm{Genc}(\\mathrm{Sim}))+\\mathsf{Adv}(\\mathcal{A}, \\mathrm{Genc}^0, \\mathrm{Genc}(\\mathrm{Sim})).$$"
                },
            ]
        },

        "Lemma 2":
        {
            "longname": "Lemma 2:\nIND-CPA security of \\(\\mathsf{se}\\) implies simulation-based security",
            "parent": "Theorem",
            "contents": [
                {
                    "text": "There exists a PPT simulator \\(\\mathrm{Sim_{Lemma2}}\\) such that for all PPT adversaries \\(\\mathcal{A}\\), $$\\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^0,\\mathrm{Genc}(\\mathrm{Sim_{Lemma2}})) = \\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^0,\\mathrm{Genc}^1),$$ where \\(\\mathrm{Sim_{Lemma2}}\\) is defined as follows:"
                },
                {
                    "graphs": [["Sim_{Lemma2}"]]
                },
                {
                    "text": "<p class=\"proofstep-title\">Proof of Lemma 2</p>"
                },
                {
                    "text":`Claim 1 establishes that \\(\\mathrm{Genc}(\\mathrm{Sim_{Lemma2}})\\) is code-equivalent to \\(\\mathrm{Genc}^1\\). We then directly obtain Lemma 2 as follows. Let \\(\\mathcal{A}\\) be a PPT adversary. Then,
$$\\begin{align}
  \\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^0,\\mathrm{Genc}(\\mathrm{Sim_{Lemma2}})) \\stackrel{\\text{def}}{=}
  &|\\text{Pr}[1=\\mathcal{A}\\rightarrow \\mathrm{Genc}^0]-
   \\text{Pr}[1=\\mathcal{A}\\rightarrow \\mathrm{Genc}(\\mathrm{Sim_{Lemma2}})]|\\\\
=&|\\text{Pr}[1=\\mathcal{A}\\rightarrow \\mathrm{Genc}^0]-
   \\text{Pr}[1=\\mathcal{A}\\rightarrow \\mathrm{Genc}^1]|\\\\
\\stackrel{\\text{def}}{=}& \\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^0,\\mathrm{Genc}^1)\\\\
\\end{align}$$`
                },
            ]
        },

        "Claim 1": {
            "longname": "Claim 1: Equivalence",
            "parent": "Lemma 2",
            "contents": [
                {
                    "text": "$$\\mathrm{Genc}^1\\stackrel{code}{\\equiv}\\mathrm{Genc}(\\mathrm{Sim}_{Lemma2})$$"
                },
                {
                    "text": "<p class=\"proofstep-title\">Proof of Claim 1</p><p>Below, in \\(\\mathrm{Genc(Sim_{Lemma2})}\\), we replace \\(\\mathrm{Sim}_{Lemma2}\\) by its definition and thereby obtain \\(\\mathrm{Hybrid\\text{-}Claim\\text{-}1}\\). We mark the definition of \\(\\mathrm{Genc(Sim_{Lemma2})}\\) by a dashed line, Removing the dashed line yields \\(\\mathrm{Genc^1}\\).</p>"
                },
                {
                    "graphs": [["Genc(Sim_{Lemma2})"], ["Hybrid-Claim-1"], ["Genc^1"], ]
                },
                {
                    "text": "<p class=\"proofstep-title\">Proof of Lemma 1</p>"
                },
                {
                    "text": `Let \\(\\mathcal{A}\\) be a PPT adversary. We prove Lemma 1 via three game-hops and bound the advantage of \\(\\mathcal{A}\\) via the triangle inequality.
$$\\begin{align}
\\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^1,\\mathrm{Genc}^0)\\leq
&\\;\\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^1,\\mathrm{Hybrid\\text{-}Lemma1}) \\\\
&+\\mathsf{Adv}(\\mathcal{A},\\mathrm{Hybrid\\text{-}Lemma1},\\mathrm{Genc}(\\mathsf{Sim}))\\\\
&+\\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}(\\mathrm{Sim}),\\mathrm{Genc}^0)\\\\
\\end{align}$$
Where the first and last advantage are obtained by reduction to simulation security while the middle term follows from code equivalence and thus is 0. The proof is visualized by the following sequence of games:
`
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

        "Claim 2:": {
            "longname": "Claim 2:\n Indistinguishability between \\(\\mathsf{Genc}\\) and \\(\\mathsf{Hybrid\\text{-}Lemma\\text{-}1}\\)",
            "parent": "Lemma 1",
            "contents": [
                {
                    "text": `For all simulators \\(\\mathrm{Sim}\\) and all adversary \\(\\mathcal{A}\\), $$\\mathsf{Adv}(\\mathcal{A},\\mathrm{Genc}^1,\\mathrm{Hybrid\\text{-}Lemma1}) =  \\mathsf{Adv}(\\mathcal{A}\\rightarrow\\mathrm{Zeroer},\\mathrm{Genc}^0,\\mathrm{Genc}(\\mathrm{Sim}))$$`
                },
                {
                    "text": "<p class=\"proofstep-title\">Proof of Claim 2</p> Using \\(\\mathrm{Zeroer}\\) as a reduction, we observe that the remaining part of the graph constitute exactly \\(\\mathrm{Genc}^0\\) and  \\(\\mathrm{Genc}(\\mathrm{Sim})\\), respectively, and Claim 2 follows."
                },
                {
                    "graphs": [["Genc^1"], ["Hybrid-Lemma-1"]]
                },
            ],
            "type":
            {
                "reduction": [
                    {
                        "i": 0, "j": 0, "cut": ["Zeroer"]
                    },
                    {
                        "i": 1, "j": 0, "cut": ["Zeroer_0"]
                    },
                ]
            }
        },

        "Claim 3": {
            "longname": "Claim 3: Equivalence",
            "parent": "Lemma 1",
            "contents": [
                {
                    "text": "\\(\\mathrm{Zeroer}\\) is idempotent, that is applying \\(\\mathrm{Zeroer}\\) twice does not change the output: $$\\mathrm{Zeroer}\\rightarrow \\mathrm{Zeroer} \\stackrel{\\text{code}}{\\equiv}\\mathrm{Zeroer}$$"
                },
                {
                    "text": "<p class=\"proofstep-title\">Proof of Claim 3</p>"
                },
                {
                    "graphs": [["Zeroer-Zeroer", "Zeroer"]]
                },
            ],
            "type":
            {
                "codeq": {
                    "columns": [
                        {
                            "packages":
                            {
                                "Zeroer-Zeroer":
                                {
                                    "oracles":
                                    {
                                        "ENC":
                                        {
                                            "code": "m' @gets 0^{|m|};c @gets \\mathsf{ENC}(m');;;@return c",
                                            "params": ["m"]
                                        }
                                    }
                                }
                            }
                        },

                        {
                            "packages":
                            {
                                "Zeroer-Zeroer'":
                                {
                                    "oracles":
                                    {
                                        "ENC":
                                        {
                                            "code": "m' @gets 0^{|m|};m'' @gets 0^{|m'|};c' @gets \\mathsf{ENC}(m'');c @gets c';@return c",
                                            "params": ["m"]
                                        }
                                    }
                                }
                            }
                        },

                        {
                            "packages":
                            {
                                "Zeroer":
                                {
                                    "oracles":
                                    {
                                        "ENC":
                                        {
                                            "code": "m' @gets 0^{|m|};c @gets \\mathsf{ENC}(m');;;@return c",
                                            "params": ["m"]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },

                "cuts": [
                    {
                        "i": 0, "j": 0,
                        "cut": ["Zeroer_0", "Zeroer"]
                    }
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
    var wrapper_width = {proof_width: '65%', oracle_width: '30%'}
    add_proof(proof, wnd_pos, wrapper_width);

    return proof;
}

var game_to_sim_notion_se_proof = driver();
