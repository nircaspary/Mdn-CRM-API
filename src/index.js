import React from 'react';
import reactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './components/css/app.css';

reactDOM.render(
  <Router>
    <App />
  </Router>,
  document.querySelector('#root')
);
