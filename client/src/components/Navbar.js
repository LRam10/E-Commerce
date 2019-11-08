import React,{useState,useRef,useEffect,useContext} from 'react'
import {Fragment} from 'react'
import {Link} from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

const Navbar= ()=> {
    let size = window.location.origin.length
    let adminUrl  = window.location.href.substring(size,size+12);
    const [visibility,setVisbility] = useState(false);
    // Dropdown sublist
    const node = useRef();
    const handleClick = e => {
        if (node.current.contains(e.target)) {
          // inside click
          return;
        }
        // outside click
        setVisbility(false);
      };
    //Outside click functioality  
    useEffect(()=>{
        document.addEventListener('mousedown',handleClick);
        return ()=>{
            document.removeEventListener('mousedown',handleClick)
        }
    },[]);
    //AuthContext
    const authContext = useContext(AuthContext);
    const { isAuthenticated,logout,user } = authContext;

    const onLogout =()=> logout();
    if(adminUrl !== `/admin-login`){
    return (
        <Fragment>

        <nav className='sticky-top' ref={node}>
        <div className="navbar navbar-expand-lg bg-dark fixed">
            <span className="navbar-brand text-white mx-auto" >WARRIOR BRACELETS</span>
            <ul className="nav justify-content-end" id='top-menu'>
                <li className="nav-item">
                    {isAuthenticated ?
                    <p className='nav-link text-white'>Hello, {user && user.firstName}</p>:
                    <Link className="nav-link text-white"to={'/login'} >Account</Link>
                    }
                </li>
                {isAuthenticated &&(
                    <li className="nav-item">
                        <a className='nav-link text-white' href='#!' onClick={onLogout}><i className="fas fa-sign-out-alt">Logout</i></a>
                    </li>
                )}
                <li className="nav-link mx-0" style={dBlue}>
                <i className="fas fa-shopping-cart"></i>
                </li>
            </ul>
        </div>
        <div style={dBlue} className="navbar justify-content-center">
            <Link className="logo" to={'/'}>W</Link>
            <ul className="nav py-2">
                <li className="nav-item ">
                    <a className="nav-link text-white"  onClick={e =>setVisbility(!visibility)}>Styles</a>
                    <ul className={'list-group position-absolute '+ (visibility?'d-inline-block':'d-none')}>
                        <li className='list-group-item' ><Link className='text-white' to={'/category/red_strings'}>Red Strings</Link></li>
                        <li className='list-group-item' ><Link className='text-white' to={'/category/wooden'}>Wooden</Link></li>
                        <li className='list-group-item' ><Link className='text-white' to={'/category/paracord'}>Paracord</Link></li>
                        <li className='list-group-item' ><Link className='text-white' to={'/category/friendship'}>Friendship</Link></li>
                    </ul>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-white" href='/about'>About Us</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-white" href='/customize'>Customize</a>
                </li>
            </ul>
        </div>
        </nav>
        </Fragment>
    )
    }
    else{
        return(
            <nav className='navbar navbar-expand-lg bg-dark py-3' ref={node}>
                <ul className='nav justify-content-end'>
                    <li className='nav-brand text-white'>Admin Login</li>
                </ul>
            </nav>
        )
    }
}
const dBlue = {
backgroundColor:"#1A80B6"
};

export default Navbar
