import React from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import NavigationHeader from './NavigationHeader/NavigationHeader';
import Definitions from './Definitions/Definitions';
import Proofs from './Proofs/Proofs';

// error from mathjax lib
const oldConsoleError = console.error
console.error = (...args) => { args[0].includes("Legacy context API") || oldConsoleError(...args) }

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <div>
          <NavigationHeader />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/definitions">
              <Definitions />
            </Route>
            <Route path="/proofs">
              <Proofs />
            </Route>
          </Switch>
        </div>
      </Router>
    </RecoilRoot>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
