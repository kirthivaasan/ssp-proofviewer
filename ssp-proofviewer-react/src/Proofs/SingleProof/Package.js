import React from 'react';
import styled from 'styled-components';
import OracleLineContent from './OracleLineContent';
import Oracle from './Oracle';

const PackageNameWrapper = styled.div`
  height: 30px;
  width: 100%;
  background-color: #DDD
`;

const OraclesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export default function Package({ oracles, name }) {
  return (
    <div>
      <PackageNameWrapper>
        <OracleLineContent content={`\\large{\\underline{${name}}}`} />
      </PackageNameWrapper>
      <OraclesWrapper>

        {oracles.map((oracle) => <Oracle key={oracle.name} {...oracle} packageName={name} />)}
      </OraclesWrapper>
    </div>
  );
}
