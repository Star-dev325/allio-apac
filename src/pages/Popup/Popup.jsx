import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import $ from 'jquery';

import Greetings from '../../containers/Greetings/Greetings';
import Reports from './Reports';
import './Popup.scss';

let htmlSource = '';

const Popup = () => {

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGlipseMode, setIsGlipseMode] = useState(false);

  return (
    <div className="App">
      <Greetings />
      <Box className='info-sector'>
        {isGlipseMode ?
          <Box className='row-container'>
            <Reports source={htmlSource} />
          </Box>
          : <Box className='row-container column'>
            <Button onClick={() => {
              setIsPending(true);
              chrome.tabs.query({ active: true }, tabs => {
                const pageURL = tabs[0].url;
                try {
                  $.get(pageURL, htmlStr => {
                    setIsPending(false);
                    if (htmlStr) setIsSuccess(true);
                    htmlSource = htmlStr;
                  });
                } catch (e) {
                  setIsSuccess(false);
                  console.log('Error message: ', e.message);
                };
              });
            }} variant='contained' disabled={isPending}>
              {isPending && <CircularProgress size={24} />} {isSuccess ? 'Parse again' : 'Parse this page'}
            </Button>
            {isSuccess && <Box className='row-container fill-space'>
              <Typography component='h2'>{isSuccess ? 'Scraping HTML has been done successfully!' : 'Error ocurred'}</Typography>
            </Box>}
          </Box>}
      </Box>
      <Box className='control-sector'>
        <Button onClick={async () => {
          localStorage.setItem('DOM_Analyzer_html_resource', htmlSource);
          await chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
        }} color='info' disabled={!isSuccess}>Open in new tab</Button>
        <Button onClick={() => {
          setIsGlipseMode(true);
        }} color='info' disabled={!isSuccess}>glimpse</Button>
      </Box>
    </div>
  );
};

export default Popup;
