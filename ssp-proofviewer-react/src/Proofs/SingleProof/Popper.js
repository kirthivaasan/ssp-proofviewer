import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { selectedOracle } from '../Model/Model';
import OracleLineContent from './OracleLineContent';

const PotentialPackageNameWrapper = styled.div`
  min-width: 70px;
  height: 40px; 
`;

export default function PopperWrapper({ popperValues, anchor, setPopperValues }) {
  const setSelectedOracle = useSetRecoilState(selectedOracle);

  return (
    <Popper open={!!popperValues} anchorEl={anchor.current} role={undefined} transition disablePortal placement="left">
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: 'left' }}
        >
          <Paper>
            <ClickAwayListener onClickAway={() => setPopperValues(null)}>
              <MenuList autoFocusItem id="menu-list-grow" onKeyDown={() => setPopperValues(null)}>
                {popperValues && popperValues.potentialPackages.map((potentialPackageName) => (
                  <MenuItem
                    key={potentialPackageName}
                    onClick={() => {
                      setSelectedOracle(
                        { package: potentialPackageName, oracle: popperValues.targetName });
                      setPopperValues(null);
                    }}
                  >
                    <PotentialPackageNameWrapper>
                      <OracleLineContent content={potentialPackageName} />
                    </PotentialPackageNameWrapper>
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
