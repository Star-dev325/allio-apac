import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import { clarifyElementList } from '../../utils';
import './Dashboard.scss';
import { Paper } from '@mui/material';

const tabCategory = [
  'Texts',
  'Links',
  'Images',
  'Audios',
  'Videos'
];

const Dashboard = () => {

  const [elementStack, setElementStack] = useState({});
  const [tabValue, setTabValue] = useState(0);

  const Texts = () => {

    const [verticalTabValue, setVerticalTabValue] = useState(Object.keys(elementStack).filter(tagName => (!(tagName === 'A' || tagName === 'AUDIO' || tagName === 'VIDEO' || tagName === 'IMG')))[0]);

    return (
      <>
        <div className='text-tabs-container'>
          <Tabs
            sx={{
              height: '100%',
              borderRight: 1,
              borderColor: 'divide'
            }}
            onChange={(e, newValue) => { setVerticalTabValue(newValue); }}
            orientation='vertical'
            value={verticalTabValue}
            variant='scrollable'
          >
            {
              Object.keys(elementStack).map((tagName, index) => {
                if (!(tagName === 'A' || tagName === 'AUDIO' || tagName === 'VIDEO' || tagName === 'IMG'))
                  return (<Tab key={index} label={tagName} value={tagName} />);
              })
            }
          </Tabs>
        </div>
        <div className='text-panel-container'>
          {elementStack[verticalTabValue] && elementStack[verticalTabValue].map((content, index) => {
            return (<Paper key={index} sx={{ m: 5, p: 5, fontSize: '1.5em', color: '#2f3337', backgroundColor: '#f6f6f6', width: '450px', height: '300px', overflowY: 'auto' }} > {content}</Paper>)
          })
          }
        </div>
      </>
    );
  }

  const Links = () => {
    return (
      <h1>Links</h1>
    )
  }

  const Images = () => {
    return (
      <h1>Images</h1>
    )
  }

  const Audios = () => {
    return (
      <h1>Audios</h1>
    )
  }

  const Videos = () => {
    return (
      <h1>Videos</h1>
    )
  }


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const elements = clarifyElementList(localStorage.getItem('DOM_Analyzer_html_resource'));
    let elementStackTemp = {};
    if (elements) {
      elements.forEach(element => {
        switch (element.tagName) {
          case 'A':
            elementStackTemp[element.tagName] = elementStackTemp[element.tagName] ? [...elementStackTemp[element.tagName], element.getAttribute('href')] : [element.getAttribute('href')];
            break;
          case 'IMG':
            elementStackTemp[element.tagName] = elementStackTemp[element.tagName] ? [...elementStackTemp[element.tagName], element.getAttribute('src')] : elementStackTemp[element.tagName] = [element.getAttribute('src')];
            break;
          case 'VIDEO' || 'AUDIO':
            elementStackTemp[element.tagName] = elementStackTemp[element.tagName] ? [...elementStackTemp[element.tagName], element.$('source').getAttribute('src')] : [element.$('source').getAttribute('src')];
            break;
          default:
            if (element.innerText) elementStackTemp[element.tagName] = elementStackTemp[element.tagName] ? [...elementStackTemp[element.tagName], element.innerText.trim()] : [element.innerText.trim()];
        }
      });
    }
    setElementStack(elementStackTemp);
    localStorage.removeItem('DOM_Analyzer_html_resource');
  }, []);

  return (
    <div className="App">
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: 'darkgrey' }}>
            DOM Serializer/ Parser
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'orange' }}>
            Result review
          </Typography>
          <Avatar
            alt='Leon Wang'
            src='https://avatars.githubusercontent.com/u/115906627?v=4'
            sx={{
              height: '50px',
              width: '50px'
            }}
          ></Avatar>
        </Toolbar>
      </AppBar>
      <div className='main-container'>
        <Tabs
          sx={{ width: '100%' }}
          value={tabValue}
          onChange={handleTabChange}
          variant='standard'
          scrollButtons
          allowScrollButtonsMobile
        >
          {tabCategory.map((category, index) => <Tab key={index} value={index} label={category} />)}
        </Tabs>
        <div className='tab-container flex-stretch'>
          {
            tabValue === 0 ? <Texts /> :
              tabValue === 1 ? <Links /> :
                tabValue === 2 ? <Images /> :
                  tabValue === 3 ? <Audios /> :
                    <Videos />
          }
        </div>
      </div>
    </div >
  );
};

export default Dashboard;
