import React from 'react';
import { useRecoilValue } from 'recoil';
import { NavLink, Route } from 'react-router-dom';
import { proofNamesSelector } from './Model/Model';
import SingleProofViewer from './SingleProofViewer';

export default function Proofs() {
  const names = useRecoilValue(proofNamesSelector);
  return (
    <div>
      <h2>Proofs</h2>
      <Route exact path="/proofs">
        {names.map((name, i) => <div key={name}><NavLink to={`/proofs/${i}`}>{name}</NavLink></div>)}
      </Route>
      {names.map((name, i) => (
        <Route path={`/proofs/${i}`} key={name}>
          <SingleProofViewer id={i} />
        </Route>
      ))}
    </div>
  );
}
