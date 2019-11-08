import React,{Fragment} from 'react';
import {Route,Switch} from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer'
import Home from './components/pages/Home';
import About from './components/pages/About';
import Customize from './components/pages/Customize';
import Styles from './components/pages/Styles'
import Admin from './components/pages/Admin';
import Register from './components/Auth/Register'
import Login from './components/Auth/Login';
import Alerts from './components/helpers/Alert'
import AdminLogin from './components/Admin/AdminLogin';

import ItemState from './context/item/ItemState';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alerts/AlertState';

import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './utils/PrivateRouting';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = ()=> {
  return (
  <AuthState>
    <ItemState>
      <AlertState> 
   <Fragment>
      <Navbar/>
      <Alerts/>
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/about' component={About}/>
          <Route exact path='/customize' component={Customize}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/register' component={Register}/>
          <Route path='/category/:style'component={Styles}/>
          <PrivateRoute exact path='/admin-login/home' component ={Admin}/>
          <Route path='/admin-login' component={AdminLogin}/>
        </Switch>
      </div>
      <Footer/>
      </Fragment>
      </AlertState>
     </ItemState> 
   </AuthState>    
  );
}

export default App;
