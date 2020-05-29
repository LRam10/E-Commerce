import React,{Fragment,useState,useContext} from 'react';
import {Link,NavLink} from 'react-router-dom';
import CategoryContext from '../../context/category/categoryContext';

 const Hamburger = ({isAuthenticated, user,onLogout,products}) => {
     const [show,setShow] = useState(false);
     const [sublist,setSublist] = useState(false);
     const categotyContext = useContext(CategoryContext);
     const{categories} = categotyContext;
    return (
        <Fragment>
            <span id="burger-menu" onClick={e=>setShow(!show)}><i className="fas fa-bars"></i></span>
            <ul className={'burger '+ (show?'slideout':'d-none')}>
                <li>{isAuthenticated ? <Fragment>
                Hello, {user && user.firstName}
                </Fragment>:
                    <NavLink className="" to={'/login'} exact activeStyle={{color:'#000'}} >Account</NavLink>
                    }</li>
                <li><span className='mr-1' onClick={e=> setSublist(!sublist)}>Styles</span>{sublist?<i className="fas fa-angle-up"></i>:<i className="fas fa-angle-down"></i>}
                    <ul className={'sublist '+ (sublist?'d-inline-block':'d-none')}>
                        {categories.map(category =>(
                            <li key={category._id}><NavLink to={{pathname:`/category/${category.category_name}`,
                        state:category}} activeStyle={{color:'#000'}} exact>{category.category_name.split('-')
                        .map( s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</NavLink></li>
                        ))}
                    </ul>
                    
                </li>
                <li><NavLink className='' to={'/about'} exact activeStyle={{color:'#000'}}>About</NavLink></li>
                <li><NavLink className='' to={'/customize'} exact activeStyle={{color:'#000'}} >Customize</NavLink></li>
                {user && <li onClick={onLogout}><i className="fas fa-sign-out-alt">Logout</i></li>}
            </ul>
            <Link to={'/cart'} id='mobileCart' className='text-dark '><i className="fas fa-shopping-cart">{products.length > 0 &&(
                    <span id='inCart' className='position-absolute'>{products.length}</span>
                )}</i></Link>
        
        </Fragment>
    )
}
export default Hamburger;