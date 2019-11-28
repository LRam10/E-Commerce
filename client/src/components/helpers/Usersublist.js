import React,{Fragment,useState} from 'react';
import {Link} from 'react-router-dom';

const Usersublist = ({user}) => {
    const [showList,setShowlist] = useState(false);
    return (
        <Fragment>
        <p className='nav-link text-white' onMouseOver={e =>setShowlist(!showList)}>Hello, {user && user.firstName}</p>
        <ul style={forward} className={'list-group position-absolute '+ (showList?'d-inline-block':'d-none')} onMouseLeave={()=>setShowlist(false)}>
            <li style={{backgroundColor:'#343a40',}} className='list-group-item'><Link className='text-white' to={`/auth/orders`}>Orders</Link></li>
        </ul>
        </Fragment>
    )
}

const forward = {
    zIndex:'1029',
    transform:'translateY(.3px)'
}
export default Usersublist;