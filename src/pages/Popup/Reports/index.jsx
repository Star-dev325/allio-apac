import React, { useState } from 'react';
import $ from 'jquery';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './index.scss';
import { useEffect } from 'react';
import { TableContainer } from '@mui/material';


const Reports = ({ source }) => {

  const [reportData, setReportData] = useState([]);

  const countElements = (arr) => {
    const elementCounts = {};
    arr.forEach(element => {
      elementCounts[element] = (elementCounts[element] || 0) + 1;
    })
    return elementCounts;
  }

  useEffect(() => {
    console.log(source);
    const elementTagListAll = $(source).find('*')
      .get()
      .map(element => element.tagName);
    const elementsCounts = countElements(elementTagListAll);
    setReportData(Object.keys(elementsCounts).map(key => ({ type: key.toLowerCase(), value: elementsCounts[key] })));
  }, []);

  return (
    <div className='main'>
      {reportData &&
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Tag Names</TableCell>
                <TableCell align='center'>Used Elements of Tag</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((factorInfo, index) => <TableRow key={index}>
                <TableCell align='center'>{factorInfo.type}</TableCell>
                <TableCell align='center'>{factorInfo.value}</TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
        </TableContainer>}
    </div >
  );
};

export default Reports;
