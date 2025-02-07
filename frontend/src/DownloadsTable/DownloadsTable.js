import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "./styles.scss"

const rows = [
  {
    full: "link",
    raw: "link",
    code: "link",
    app: "link",
    checkpoints: "link"
  }
];

function DownloadsTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Full Dataset</TableCell>
            <TableCell>Raw Dataset</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Data Collection App</TableCell>
            <TableCell>Model Checkpoints</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.full}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{row.full}</TableCell>
              <TableCell>{row.raw}</TableCell>
              <TableCell>{row.code}</TableCell>
              <TableCell>{row.app}</TableCell>
              <TableCell>{row.checkpoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DownloadsTable;
