import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { proofById } from './Model/Model';
import MathJaxContent from '../MathJax/MathJaxContent';

const ascii = 'U = 1/(R_(si) + sum_(i=1)^n(s_n/lambda_n) + R_(se))';

const asciimath = '`sum_(i=1)^n i^3=((n(n+1))/2)^2`';
const math = String.raw`
  <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
    <menclose notation="circle box">
      <mi> x </mi><mo> + </mo><mi> y </mi>
    </menclose>
  </math>

  $$\lim_{x \to \infty} \exp(-x) = 0$$

  ${asciimath}`;

const PackageNameWrapper = styled.div`
  height: 30px;
  width: 100%;
  background-color: #DDD
  
`;

const OracleColumn = styled.div`
  flex-direction: column;
  display: flex;
`;

const OracleWrapper = styled.div`
  flex-direction: column;
  display: flex;
  padding-left: 10px;
`;

const SigleLine = styled.div`
 margin-bottom: 10px;
 padding-top: 0px;
 height: 45px;
`;

const OracleNameWrapper = styled.div`
  background-color: #EEE;
  margin-top: 10px;
  margin-bottom: 30px;
  height: 30px;
`;

const OracleNameInnerWrapper = styled.div`
`;

function Oracle({
  oracles, name, code, params,
}) {
  const args = params.length === 0 ? '' : `(${params.join(', ')})`;

  console.log(args);
  return (
    <OracleWrapper>
      <OracleNameWrapper>
        <OracleNameInnerWrapper>
        <MathJaxContent content={`\\underline{${name}${args}}`} />
        </OracleNameInnerWrapper>
      </OracleNameWrapper>
       <OracleColumn>
         {code.split('\\\\').map((line, id) => (<SigleLine><MathJaxContent content={line} /></SigleLine>))}
           </OracleColumn>
    </OracleWrapper>
  );
}

function Package({ oracles, name }) {
  return (
    <div>
      <PackageNameWrapper>
        <MathJaxContent content={`\\large{\\underline{${name}}}`} />
      </PackageNameWrapper>
      {oracles.map((oracle) => <Oracle key={oracle.name} {...oracle} />)}
    </div>
  );
}

export default function SingleProofViewer({ id }) {
  const proof = useRecoilValue(proofById(id));

  return (
    <div>
      <div>{JSON.stringify(proof)}</div>
      <div>
        {proof.monolithicPackages.map((pcg) => <Package {...pcg} />)}
      </div>
    </div>
  );
}
