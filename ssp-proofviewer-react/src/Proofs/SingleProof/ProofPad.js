import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import styled from 'styled-components';
import ProofContext from './ProofContext';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const CeilWrapper = styled.div`
  padding-top: 20px;
`;

function ContentCeilText({ text }) {
  return <CeilWrapper>{text}</CeilWrapper>;
}

function ContentCeilGraph({ graphs }) {
  return <CeilWrapper>{graphs}</CeilWrapper>;
}

function ContentCeil({ text, graphs, title }) {
  return <><Typography variant="h6" gutterBottom component="div">{title}</Typography>{text ? <ContentCeilText text={text} /> : <ContentCeilGraph graphs={graphs} />}</>;
}

function Row({ name, contents, longName }) {
  const [open, setOpen] = React.useState(true);
  const classes = useRowStyles();

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="h5" gutterBottom component="div">
            {name}
          </Typography>
          <Typography variant="h6" gutterBottom component="div">
            {longName}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              {/* eslint-disable-next-line react/no-array-index-key */}
              {contents.map((content, idx) => <ContentCeil key={`${name}${idx}`} {...content} />)}
            </TableCell>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function CollapsibleTable() {
  const { name, proofTree } = useContext(ProofContext);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>{name}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proofTree && proofTree.map((row) => (
            <Row key={row.name} {...row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
