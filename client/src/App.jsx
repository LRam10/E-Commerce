import React,{Fragment} from 'react';
import './App.css';
import PageLayout from './layouts/PageLayout';

// import Navbar from './components/Nav/Navbar';
// import Footer from './components/Footer';
// import Home from './components/Home/Home';
// import About from './components/pages/About';
// import Customize from './components/pages/Customize';
// import Styles from './components/pages/Styles'
// import Admin from './components/pages/Admin';
// import Register from './components/Auth/Register'
// import Login from './components/Auth/Login';
// import Alerts from './components/helpers/Alert'
// import AdminLogin from './components/Admin/AdminLogin';
// import InfoItem from './components/pages/InfoItem';
// import Orders from './components/pages/Orders';
// import Cart from './components/pages/Cart';

// import ItemState from './context/item/ItemState';
// import AuthState from './context/auth/AuthState';
// import AlertState from './context/alerts/AlertState';
// import CartState from './context/cart/CartState';
// import OrderState from './context/order/OrderState';
// import CategoryState from './context/category/CategoryState';

// import setAuthToken from './utils/setAuthToken';
// import PrivateRoute from './utils/PrivateRouting';
// import AuthPrivate from './utils/AuthPrivate';

// if(localStorage.token){
//   setAuthToken(localStorage.token);
// }
//Math.floor(new Date().getTime()/1000.0) -----> Set time to epoch time
//259200 equals to 3 days in epoch time
//86400 -----> one day
//3600 seconds -----> one hour
const App = ()=> {
  return (
  <PageLayout/>
  );
}

export default App;
