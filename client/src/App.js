import React,{Fragment} from 'react';
import {Route,Switch} from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer'
import Home from './components/pages/Home';
import About from './components/pages/About';
import Customize from './components/pages/Customize';
import Styles from './components/pages/Styles'

import ItemState from './context/item/ItemState';
import Admin from './components/pages/Admin';

const App = ()=> {
  return (
  <ItemState> 
   <Fragment>
      <Navbar/>
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/about' component={About}/>
          <Route exact path='/customize' component={Customize}/>
          <Route path='/category/:style'component={Styles}/>
          <Route path='/admin-login/home' component ={Admin}/>
        </Switch>
      </div>
      <Footer/>
      </Fragment>
   </ItemState>     
  );
}

export default App;
