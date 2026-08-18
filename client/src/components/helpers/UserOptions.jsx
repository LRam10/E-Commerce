import React,{useState} from 'react';
import { Link } from 'react-router-dom';

const UserOptions = ({user,onLogout}) => {
    const [showList,setShowlist] = useState(false);
    const handleToggle = (e)=>{
      e.stopPropagation();
      setShowlist(true);
    }
    return (
      <div className="relative border-[2px] border-solid border-[#cecece] rounded" onMouseOver={handleToggle}>
        <div className="flex items-center px-4 py-2 cursor-pointer">
          <svg className="w-6 h-6  dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="#404040" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 11 14H9a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 10 19Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <p className='px-3 text-dark'>Hello, {user && user.firstName}</p>
        </div>

        <ul style={forward} className={'absolute top-[100%] bg-white w-full right-0 cursor-pointer ' + (showList ? 'block' : 'hidden')} onMouseLeave={() => setShowlist(false)}>
          <li className="text-center hover:bg-[#d60c37] hover:text-white py-2 px-3"><Link className='text-dark' to={`/orders`}>My Orders</Link></li>
          <li className="text-center hover:bg-[#d60c37] hover:text-white py-2 px-3">
            <span className="text-dark" onClick={onLogout}>
              Logout <i className="fas fa-sign-out-alt"></i>
            </span>
          </li>
        </ul>
      </div>
    )
}

const forward = {
    zIndex:'1029',
    transform:'translateY(.3px)'
}
export default UserOptions;