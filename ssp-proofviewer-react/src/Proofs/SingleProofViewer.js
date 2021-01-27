import React from 'react';
import { useRecoilValue } from 'recoil';
import MathJax from 'react-mathjax2';
import { proofById } from './Model/Model';

const ascii = 'U = 1/(R_(si) + sum_(i=1)^n(s_n/lambda_n) + R_(se))';
const content = `This can be dynamic text (e.g. user-entered) text with ascii math embedded in symbols like $$${ascii}$$`;

const asciimath = '`sum_(i=1)^n i^3=((n(n+1))/2)^2`';
const math = String.raw`
  <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
    <menclose notation="circle box">
      <mi> x </mi><mo> + </mo><mi> y </mi>
    </menclose>
  </math>

  $$\lim_{x \to \infty} \exp(-x) = 0$$

  ${asciimath}`;

export default function SingleProofViewer({ id }) {
  const proof = useRecoilValue(proofById(id));

  return (
    <div>
      <div>{JSON.stringify(proof)}</div>
      <MathJax.Context
        input="ascii"
        onLoad={() => console.log('Loaded MathJax script!')}
        onError={(MathJaxTop, error) => {
          MathJaxTop.Hub.Queue(
            MathJaxTop.Hub.Typeset(),
          );
        }}
        script="/MathJax.js"
        options={{
          asciimath2jax: {
            useMathMLspacing: true,
            delimiters: [['$$', '$$']],
            preview: 'none',
          },
        }}
      >
        <MathJax.Text text={content} />
      </MathJax.Context>
    </div>
  );
}
