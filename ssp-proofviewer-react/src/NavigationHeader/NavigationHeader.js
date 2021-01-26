import React from 'react';
import styled from 'styled-components';
import {
  Link,
} from 'react-router-dom';

const NavLink = styled.div`
  background-color: #888;
  height: 20px;
  margin: 10px;
  padding: 10px;
`;

const HeaderRow = styled.div`
  background-color: #444444;
  flex-direction: row;
  width: 100%;
  flex: 1;
  display: flex;
`;

export default function NavigationHeader() {
  return (
    <HeaderRow>
      <NavLink>
        <Link to="/">Home</Link>
      </NavLink>
      <NavLink>
        <Link to="/definitions">Definitions</Link>
      </NavLink>
      <NavLink>
        <Link to="/proofs">Proofs</Link>
      </NavLink>
    </HeaderRow>
  );
}
