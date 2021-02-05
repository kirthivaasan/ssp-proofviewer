export default {
  name: 'Indistinguishability chosen plaintext attack (IND-CPA)',
  monolithicPackages: [
    {
      name: 'Enc^0',
      oracles:
      [
        {
          name: 'ENC',
          code: `   k \\gets GET() \\\\
                    c \\gets$ enc_k(m)\\\\
                    x \\href{why-equal.html}{=} y^2 + 1 \\\\
                    \\mathbf{return} c  `,
          params: ['m'],
        },
      ],
    },
    {
      name: 'Enc^1',
      oracles: [
        {
          name: 'ENC',
          code: `   k \\gets GET() \\\\
                    c \\gets$ enc_k(0^{|m|})\\\\
                    x \\href{why-equal.html}{=} y^2 + 1 \\\\
                    \\mathbf{return} c  `,
          params: ['m'],
        },
      ],
    },
  ],
  monolithic_pkgs:
    {
      'Enc^0':
        {
          oracles:
            {
              ENC:
                {
                  code: 'k @gets GET(); c @sample enc_k(m); @return c',
                  params: ['m'],
                },
            },
        },

      'Enc^1':
        {
          oracles:
            {
              ENC:
                {
                  code: 'k @gets GET();c @sample enc_k(0^{|m|}); @return c',
                  params: ['m'],
                },
            },
        },

      'Enc^0-Lr':
        {
          oracles:
            {
              ENC:
                {
                  code: 'k @gets GET();c @sample enc_k(m_0); @return c',
                  params: ['m_0', 'm_1'],
                },
            },
        },

      'Enc^1-Lr':
        {
          oracles:
            {
              ENC:
                {
                  code: 'k @gets GET();c @sample enc_k(m_1); @return c',
                  params: ['m_0', 'm_1'],
                },
            },
        },

      Key:
        {
          oracles:
            {
              SAMPLE:
                {
                  code: '@assert k = @bot;k @sample \\{0,1\\}^\\lambda;',
                  params: [],
                },

              GET:
                {
                  code: '@assert k \\neq @bot;@return k;',
                  params: [],
                },
            },

        },

    },

  modular_pkgs:
    {
      'Gind-cpa^0':
        {
          oracles: [['Key', 'SAMPLE'], ['Enc^0', 'ENC']],
          graph:
            {
              'Enc^0': [['Key', 'GET']],
              Key: [],
            },

          layout:
            {
              nodes: {
                '@oracles_interface': {
                  x: 0, y: 60, width: 1, height: 90,
                },
                'Enc^0': {
                  x: 90, y: 110, width: 90, height: 40,
                },
                Key: {
                  x: 240, y: 60, width: 90, height: 40,
                },
              },
              edges: { '@oracles_interface': { Key: 'exitX=1;exitY=0.2;entryX=0;entryY=0.4;exitDx=0;exitDy=0;entryDx=0;entryDy=0;', 'Enc^0': 'exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;' }, 'Enc^0': { Key: 'exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.2;entryY=0.6;entryDx=0;entryDy=0;' } },
            },
        },

      'Gind-cpa^1':
        {
          oracles: [['Key', 'SAMPLE'], ['Enc^1', 'ENC']],
          graph:
            {
              'Enc^1': [['Key', 'GET']],
              Key: [],
            },

          layout:
            {
              nodes: {
                '@oracles_interface': {
                  x: 0, y: 60, width: 1, height: 90,
                },
                'Enc^1': {
                  x: 90, y: 110, width: 90, height: 40,
                },
                Key: {
                  x: 240, y: 60, width: 90, height: 40,
                },
              },
              edges: { '@oracles_interface': { Key: 'exitX=1;exitY=0.2;entryX=0;entryY=0.4;exitDx=0;exitDy=0;entryDx=0;entryDy=0;', 'Enc^1': 'exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;' }, 'Enc^1': { Key: 'exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.2;entryY=0.6;entryDx=0;entryDy=0;' } },
            },
        },

      'Gind-cpa^0-Lr':
        {
          oracles: [['Key', 'SAMPLE'], ['Enc^0-Lr', 'ENC']],
          graph:
            {
              'Enc^0-Lr': [['Key', 'GET']],
              Key: [],
            },

          layout:
            {
              nodes: {
                '@oracles_interface': {
                  x: 0, y: 60, width: 1, height: 90,
                },
                'Enc^0-Lr': {
                  x: 90, y: 110, width: 90, height: 40,
                },
                Key: {
                  x: 240, y: 60, width: 90, height: 40,
                },
              },
              edges: { '@oracles_interface': { Key: 'exitX=1;exitY=0.2;entryX=0;entryY=0.4;exitDx=0;exitDy=0;entryDx=0;entryDy=0;', 'Enc^0-Lr': 'exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;' }, 'Enc^0-Lr': { Key: 'exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.2;entryY=0.6;entryDx=0;entryDy=0;' } },
            },
        },

      'Gind-cpa^1-Lr':
        {
          oracles: [['Key', 'SAMPLE'], ['Enc^1-Lr', 'ENC']],
          graph:
            {
              'Enc^1-Lr': [['Key', 'GET']],
              Key: [],
            },

          layout:
            {
              nodes: {
                '@oracles_interface': {
                  x: 0, y: 60, width: 1, height: 90,
                },
                'Enc^1-Lr': {
                  x: 90, y: 110, width: 90, height: 40,
                },
                Key: {
                  x: 240, y: 60, width: 90, height: 40,
                },
              },
              edges: { '@oracles_interface': { Key: 'exitX=1;exitY=0.2;entryX=0;entryY=0.4;exitDx=0;exitDy=0;entryDx=0;entryDy=0;', 'Enc^1-Lr': 'exitX=1;exitY=0.8;entryX=0;entryY=0.5;entryPerimeter=1;exitDx=0;exitDy=0;' }, 'Enc^1-Lr': { Key: 'exitX=0.5;exitY=0.5;exitPerimeter=1;entryX=0.2;entryY=0.6;entryDx=0;entryDy=0;' } },
            },
        },

    },

  prooftree:
    {
      Def:
        {
          parent: null,
          contents: [
            {
              text: 'Indistinguishability under Chosen-Plaintext Attack or \\(\\mathsf{IND\\text{-}CPA}\\) is defined as the indistinguishability between the games \\(\\mathsf{Gind\\text{-}cpa^0}\\) and \\(\\mathsf{Gind\\text{-}cpa^1}\\). Intuitively, what it says, is that no PPT adversary can tell the difference between an encryption of a message that was submitted by the adversary, and an encryption of all 0s. This flavour of IND-CPA is also called Real-Zeroes IND-CPA. (TODO explain why we provide adversary SAMPLE() - because the key anyway needs to be sampled and we might as well allow the adversary to do it.',
            },
            {
              graphs: [['Gind-cpa^0', 'Gind-cpa^1']],
            },
            {
              text: 'Another equivalent notion of IND-CPA is called Left-Right IND-CPA. In this setup, the ENC oracle expects two messages \\(m_0, m_1\\) and encrypts either \\(m_0\\) ("left message"), if in the real game or \\(m_1\\) ("right message"), if in the ideal game.',
            },
            {
              graphs: [['Gind-cpa^0-Lr', 'Gind-cpa^1-Lr']],
            },
          ],
        },
    },
};
