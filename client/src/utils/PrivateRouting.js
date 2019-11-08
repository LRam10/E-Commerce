import React ,{useContext} from 'react';
import {Route,Redirect} from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

const PrivateRoute = ({component:Component, ...rest})=>{
    const authContext = useContext(AuthContext);
    const { isAuthenticated,accessType } = authContext;
    return(
        <Route {...rest} render={props => !isAuthenticated && accessType !== 1 ? (
            <Redirect to='/admin-login'/>
        ):
        (<Component {...props}/>)}/>
    )

}

export default PrivateRoute;