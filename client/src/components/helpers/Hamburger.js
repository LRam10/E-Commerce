import React,{Fragment,useState} from 'react';
import {Link,NavLink} from 'react-router-dom';

 const Hamburger = ({isAuthenticated, user,onLogout}) => {
     const [show,setShow] = useState(false);
     const [sublist,setSublist] = useState(false);
    return (
        <Fragment>
            <span id="burger-menu" onClick={e=>setShow(!show)}><i className="fas fa-bars"></i></span>
            <ul className={'burger '+ (show?'slideout':'d-none')}>
                <li>{isAuthenticated ? <Fragment>
                Hello, {user && user.firstName}
                </Fragment>:
                    <NavLink className="" to={'/login'} exact activeStyle={{color:'#000'}} >Account</NavLink>
                    }</li>
                <li><span className='mr-1' onClick={e=> setSublist(!sublist)}>Styles</span>{sublist?<i class="fas fa-angle-up"></i>:<i class="fas fa-angle-down"></i>}
                    <ul className={'sublist '+ (sublist?'d-inline-block':'d-none')}>
                        <li className='' ><NavLink to={'/category/red_Strings'} activeStyle={{color:'#000'}} exact>Red Strings</NavLink></li>
                        <li className='' ><NavLink to={'/category/wooden'} activeStyle={{color:'#000'}} exact>Wooden</NavLink></li>
                        <li className='' ><NavLink to={'/category/paracord'} activeStyle={{color:'#000'}} exact>Paracord</NavLink></li>
                        <li className='' ><NavLink to={'/category/friendship'} activeStyle={{color:'#000'}} exact>Friendship</NavLink></li>
                    </ul>
                </li>
                <li><NavLink className='' to={'/about'} exact activeStyle={{color:'#000'}}>About</NavLink></li>
                <li><NavLink className='' to={'/customize'} exact activeStyle={{color:'#000'}} >Customize</NavLink></li>
                {user && <li onClick={onLogout}><i className="fas fa-sign-out-alt">Logout</i></li>}
            </ul>
        </Fragment>
    )
}
export default Hamburger;