import React,{Fragment} from 'react';
import {Route,Switch} from 'react-router-dom';
import './App.css';

import Navbar from './components/Nav/Navbar';
import Footer from './components/Footer';
import Home from './components/Home/Home';
import About from './components/pages/About';
import Customize from './components/pages/Customize';
import Styles from './components/pages/Styles'
import Admin from './components/pages/Admin';
import Register from './components/Auth/Register'
import Login from './components/Auth/Login';
import Alerts from './components/helpers/Alert'
import AdminLogin from './components/Admin/AdminLogin';
import ItemInfo from './components/Items/ItemInfo';
import Orders from './components/pages/Orders';
import Cart from './components/pages/Cart';

import ItemState from './context/item/ItemState';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alerts/AlertState';
import CartState from './context/cart/CartState';
import OrderState from './context/order/OrderState';
import CategoryState from './context/category/CategoryState';

import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './utils/PrivateRouting';
import AuthPrivate from './utils/AuthPrivate';

if(localStorage.token){
  setAuthToken(localStorage.token);
}
//Math.floor(new Date().getTime()/1000.0) -----> Set time to epoch time
//259200 equals to 3 days in epoch time
//86400 -----> one day
//3600 seconds -----> one hour
const App = ()=> {
  return (
  <AuthState>
    <CategoryState>
    <ItemState>
      <CartState>
        <OrderState>
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
          <AuthPrivate exact path='/auth/orders' component={Orders}/>
          <Route exact path='/cart'component={Cart}/>
          <Route path='/item/:name' component={ItemInfo}/>
        </Switch>
      </div>
      <Footer/>
      </Fragment>
        </AlertState>
        </OrderState>
      </CartState>
     </ItemState> 
     </CategoryState>
   </AuthState>    
  );
}

export default App;
