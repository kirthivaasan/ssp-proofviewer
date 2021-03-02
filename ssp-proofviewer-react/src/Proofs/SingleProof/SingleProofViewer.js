import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { proofById } from '../Model/Model';
import Package from './Package';
import ProofContext from './ProofContext';
import ProofPad from './ProofPad';

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

export default function SingleProofViewer({ id }) {
  const proof = useRecoilValue(proofById(id));
  return (
    <Page>
      <ProofContext.Provider value={proof}>
        <ProofPad />
        <PackagesColumn>
          {proof.monolithicPackages.map((pcg) => <Package key={pcg.name} {...pcg} />)}
        </PackagesColumn>
      </ProofContext.Provider>
    </Page>
  );
}
