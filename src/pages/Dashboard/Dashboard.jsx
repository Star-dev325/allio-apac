import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
        <Box sx={{ height: '100%' }}>
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
        </Box>
        <Box className='text-panel-container'>
          {elementStack[verticalTabValue] ?
            elementStack[verticalTabValue].map((content, index) => {
              return (<Paper key={index} sx={{ m: 5, p: 5, fontSize: '1.5em', color: '#2f3337', backgroundColor: '#f6f6f6', width: '80%', height: 'fit-content' }} > {content}</Paper>)
            })
            : <Typography component='h1'>No Content Text.</Typography>
          }
        </Box>
      </>
    );
  };

  const Links = () => {
    return (
      <Box sx={{ p: 5, display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
        {
          elementStack['A'] ?
            elementStack['A'].map((url, index) => <Box key={index} sx={{ fontSize: '1.5em', m: 3, width: '60%' }}><a href={url} target='_blank'>{url}</a></Box>)
            : <Typography component='h1'>No Link.</Typography>
        }
      </Box>
    );
  };

  const Images = () => {
    return (
      <Box sx={{ p: 5, display: 'flex', width: '100%', height: '100%', flexWrap: 'wrap' }}>
        {
          elementStack['IMG'] ?
            elementStack['IMG'].map((imgInfo, index) => <Box key={index} sx={{ p: 2, m: 3, display: 'flex', width: '400px', height: '300px', flexDirection: 'column', justifyContent: 'space-around' }}><img src={imgInfo.src} width='100%' height='100%' /><h2>{imgInfo.alt}</h2></Box>)
            : <Typography component='h1'>No Image.</Typography>
        }
      </Box>
    );
  };

  const Audios = () => {
    return (
      <Box sx={{ p: 5, display: 'flex', width: '100%', height: '100%', flexWrap: 'wrap' }}>
        {
          elementStack['AUDIO'] ?
            elementStack['AUDIO'].map((audioInfo, index) => <Box key={index} sx={{ p: 3, m: 3, display: 'flex', width: '300px', height: '200px', flexDirection: 'column', justifyContent: 'space-around' }}>
              <audio controls>
                <source src={audioInfo.src} type='audio/ogg' />
                <source src={audioInfo.src} type='audio/mpeg' />
              </audio>
              <h2>{audioInfo.text}</h2>
            </Box>)
            : <Typography component='h1'>No Audio</Typography>
        }
      </Box>
    );
  };

  const Videos = () => {
    return (
      <Box sx={{ p: 5, display: 'flex', width: '100%', height: '100%', flexWrap: 'wrap' }}>
        {
          elementStack['VIDEO'] ?
            elementStack['VIDEO'].map((videoInfo, index) => <Box key={index} sx={{ p: 3, m: 3, display: 'flex', width: '300px', height: '200px', flexDirection: 'column', justifyContent: 'space-around' }}>
              <video controls>
                <source src={videoInfo.src} type='video/mp4' />
                <source src={videoInfo.src} type='video/ogg' />
              </video>
              <h2>{videoInfo.text}</h2>
            </Box>)
            : <Typography component='h1'>No Audio</Typography>
        }
      </Box>
    );
  };

  useEffect(() => {
    async function init() {
      const elements = await clarifyElementList(localStorage.getItem('DOM_Analyzer_html_resource'));
      let elementStackTemp = {};
      if (elements) {
        elements.forEach(element => {
          switch (element.tagName) {
            case 'A':
              elementStackTemp[element.tagName] = elementStackTemp[element.tagName] ? [...elementStackTemp[element.tagName], element.getAttribute('href')] : [element.getAttribute('href')];
              break;
            case 'IMG':
              elementStackTemp[element.tagName] = elementStackTemp[element.tagName] ? [...elementStackTemp[element.tagName], { src: element.getAttribute('src'), alt: element.getAttribute('src') }] : elementStackTemp[element.tagName] = [{ src: element.getAttribute('src'), alt: element.getAttribute('src') }];
              break;
            case 'AUDIO':
              if (element.childElementCount)
                elementStackTemp[element.tagName] = elementStackTemp[element.tagName] ? [...elementStackTemp[element.tagName], { src: element.firstElementChild.getAttribute('src'), text: element.outerText }] : [{ src: element.firstElementChild.getAttribute('src'), text: element.outerText }];
              break;
            case 'VIDEO':
              if (element.childElementCount) {
                chrome.tabs.query({ active: true }, tabs => {
                  elementStackTemp[element.tagName] = elementStackTemp[element.tagName] ? [...elementStackTemp[element.tagName], { src: element.firstElementChild.getAttribute('src'), text: element.outerText }] : [{ src: element.firstElementChild.getAttribute('src'), text: element.outerText }];
                });
              }
              break;
            default:
              if (element.innerText) elementStackTemp[element.tagName] = elementStackTemp[element.tagName] ? [...elementStackTemp[element.tagName], element.innerText.trim()] : [element.innerText.trim()];
          }
        });
      }
      setElementStack(elementStackTemp);
      localStorage.removeItem('DOM_Analyzer_html_resource');
    }
    init();
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
      <Box className='main-container'>
        <Tabs
          sx={{ width: '100%' }}
          value={tabValue}
          onChange={(e, newValue) => { setTabValue(newValue); }}
          variant='standard'
          scrollButtons
          allowScrollButtonsMobile
        >
          {tabCategory.map((category, index) => <Tab key={index} value={index} label={category} />)}
        </Tabs>
        <Box className='tab-container flex-stretch'>
          {
            tabValue === 0 ? <Texts /> :
              tabValue === 1 ? <Links /> :
                tabValue === 2 ? <Images /> :
                  tabValue === 3 ? <Audios /> :
                    <Videos />
          }
        </Box>
      </Box>
    </div >
  );
};

export default Dashboard;
