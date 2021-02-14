import React, { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import OracleLineContent from './OracleLineContent';
import { isSelectedOracle } from '../Model/Model';
import Popper from './Popper';
import useMathJaxEventHandler from './useMathJaxEventHandler';
import useScrollOnFocus from './useScrollOnFocus';

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

export default function Oracle({
  name, code, params, packageName,
}) {
  const [popperValues, setPopperValues] = useState(null);
  useMathJaxEventHandler({ name, packageName, setPopperValues });

  const args = !params || params.length === 0 ? '' : `(${params.join(', ')})`;

  const ref = useRef();
  const isSelected = useRecoilValue(isSelectedOracle({ oracleName: name, packageName }));

  useScrollOnFocus({ isSelected, target: ref });

  return (
    <OracleWrapper ref={ref}>
      <Popper
        popperValues={popperValues}
        setPopperValues={setPopperValues}
        anchor={ref}
      />
      <OracleNameWrapper isSelected={isSelected}>
        <OracleNameInnerWrapper>
          <OracleLineContent content={`\\underline{${name}${args}}`} />
        </OracleNameInnerWrapper>
      </OracleNameWrapper>
      <OracleColumn>
        {code.split('\\\\').map((line) => (<SigleLine key={line}><OracleLineContent content={line} sourceOracle={name} sourcePackage={packageName} /></SigleLine>))}
      </OracleColumn>
    </OracleWrapper>
  );
}
