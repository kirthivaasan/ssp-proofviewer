import React, { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { isSelectedOracle, proofById, selectedOracle } from './Model/Model';
import MathJaxContent from '../MathJax/MathJaxContent';

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

const OraclesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const SigleLine = styled.div`
 padding-bottom: 15px;
 height: 20px;
`;

const OracleNameWrapper = styled.div`
  background-color: ${({ isSelected }) => (isSelected ? '#AAA' : '#EEE')};
  margin-top: 10px;
  margin-bottom: 5px;
  height: 30px;
`;

const OracleNameInnerWrapper = styled.div`
  margin-top: -12px;
`;

const Page = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex: 1;
`;

const PackagesColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const ProofColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  overflow: hidden;
`;

function Oracle({
  name, code, params, packageName,
}) {
  const args = params.length === 0 ? '' : `(${params.join(', ')})`;

  const ref = useRef();
  const isSelected = useRecoilValue(isSelectedOracle({ oracleName: name, packageName }));
  const setSelectedOracle = useSetRecoilState(selectedOracle);
  useEffect(() => {
    if (isSelected) {
      ref.current.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
      setTimeout(() => { setSelectedOracle({}); }, 1000);
    }
  },
  [isSelected, setSelectedOracle]);

  return (
    <OracleWrapper ref={ref}>
      <OracleNameWrapper isSelected={isSelected}>
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
      <OraclesWrapper>

        {oracles.map((oracle) => <Oracle key={oracle.name} {...oracle} packageName={name} />)}
      </OraclesWrapper>
    </div>
  );
}

export default function SingleProofViewer({ id }) {
  const proof = useRecoilValue(proofById(id));

  const setSelectedOracle = useSetRecoilState(selectedOracle);

  useEffect(() => {
    const listener = ({ detail }) => {
      // TODO
      const nameTheFirstPackageContainingOracle = proof.monolithicPackages
        .find(({ oracles }) => !!(oracles.find(({ name }) => name === detail))).name;
      setSelectedOracle({ package: nameTheFirstPackageContainingOracle, oracle: detail });
    };
    window.addEventListener('oracleSelected', listener);
    return () => window.removeEventListener('oracleSelected', listener);
  }, [proof.monolithicPackages, setSelectedOracle]);

  return (
    <Page>
      <ProofColumn>{JSON.stringify(proof)}</ProofColumn>
      <PackagesColumn>
        {proof.monolithicPackages.map((pcg) => <Package {...pcg} />)}
      </PackagesColumn>
    </Page>
  );
}
