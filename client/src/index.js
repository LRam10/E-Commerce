import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import {store} from '../src/app/store';
import {Provider} from 'react-redux';
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
 <Provider store={store}>  
<Router basename='/'>
<App />
</Router>
</Provider>  
, document.getElementById('root'));

