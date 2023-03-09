import React, { Component } from 'react';
import icon from '../../assets/img/icon-128.png';

const GreetingComponent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h1>DOM Serializer/Parser</h1>
    <img src={icon} alt="extension icon" />
  </div>
)

export default GreetingComponent;
