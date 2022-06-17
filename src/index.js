
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { globStore } from "./store/redusersAll.js";


ReactDOM.render(
  <Provider store={globStore} >
    <App /> 
  </Provider>,
  document.getElementById('root')
);  

