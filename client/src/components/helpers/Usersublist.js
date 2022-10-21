import React,{Fragment,useState} from 'react';
import {Link} from 'react-router-dom';

const Usersublist = ({user,onLogout}) => {
    const [showList,setShowlist] = useState(false);
    return (
        <Fragment>
        <p className='nav-link text-dark' onMouseOver={e =>setShowlist(!showList)}>Hello, {user && user.firstName}</p>
        <ul style={forward} className={'list-group position-absolute '+ (showList?'d-inline-block':'d-none')} onMouseLeave={()=>setShowlist(false)}>
            <li className='list-group-item'><Link className='text-dark' to={`/auth/orders`}>Orders</Link></li>
            <li className="list-group-item">
              <span className="text-dark" onClick={onLogout}>
                Logout <i className="fas fa-sign-out-alt"></i>
              </span>
            </li>
        </ul>
        </Fragment>
    )
}

const forward = {
    zIndex:'1029',
    transform:'translateY(.3px)'
}
export default Usersublist;