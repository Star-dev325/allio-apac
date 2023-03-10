import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { clarifyElementList } from '../../../utils';
import './Reports.scss';
import { useEffect } from 'react';
import { TableContainer } from '@mui/material';

const Reports = ({ source }) => {

  const [reportData, setReportData] = useState([]);
  const [numLinkPage, setNumLinkPage] = useState(0);

  const countElements = (arr) => {
    const elementCounts = {};
    arr.forEach(element => {
      elementCounts[element] = (elementCounts[element] || 0) + 1;
    });
    return elementCounts;
  }

  useEffect(() => {
    const elements = clarifyElementList(source);
    const elementsCounts = countElements(elements.map(element => element.tagName));
    if (Object.keys(elementsCounts).includes('A')) {
      setNumLinkPage(elementsCounts['A']);
    } else setNumLinkPage(0);
    setReportData(Object.keys(elementsCounts).map(key => ({ type: key, value: elementsCounts[key] })));
  }, []);

  return (
    <div className='main'>
      {reportData &&
        <>
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
                  <TableCell align='center'>{`< ${factorInfo.type} >`}</TableCell>
                  <TableCell align='center'>{factorInfo.value}</TableCell>
                </TableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
          <h3>Found <span>{numLinkPage}</span> linked pages in this page.</h3>
        </>
      }
    </div >
  );
};

export default Reports;
