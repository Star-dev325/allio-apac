import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
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
      <div className='info-sector'>
        {isGlipseMode ?
          <div className='row-container'>
            <Reports source={htmlSource} />
          </div>
          : <div className='row-container column'>
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
            {isSuccess && <div className='row-container fill-space'>
              <h2>{isSuccess ? 'Scraping HTML has been done successfully!' : 'Error ocurred'}</h2>
            </div>}
          </div>}
      </div>
      <div className='control-sector'>
        <Button onClick={() => {
          chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html'), active: true });
        }} color='info' disabled={!isSuccess}>Open in new tab</Button>
        <Button onClick={() => {
          setIsGlipseMode(true);
        }} color='info' disabled={!isSuccess}>glimpse</Button>
      </div>
    </div>
  );
};

export default Popup;
