import React,{useState,useContext} from 'react'
import AuthContext from '../../context/auth/authContext';
const Sidebar = (props) => {
    const {toggle} = props;
    const [show,setShow] = useState(false);
    const changeToEdit = (e) =>toggle(false,e.target.dataset.cat);

    const changeToCreate = (e)=>{
        setShow(false)
        toggle(true,e.target.dataset.cat);
    }
    const authContext = useContext(AuthContext)
    const onLogout = ()=>{
        authContext.logout();
    }
    return (
        <nav className='nav sidenav flex-column bg-dark text-white'>
            <ul style={{paddingLeft:'0'}}>
                <li className={`nav-link `+(!show ? 'active':'')} data-cat=' ' onClick={changeToCreate}>Create Item</li>
                <li className={`nav-link `+(show ? 'active':'')}><span className='d-block' onClick={(e) => setShow(!show)}>Delete/Edit</span>
                <ul  className={show ? 'd-inline-block':'d-none'}>
                    <li data-cat='Red_Strings' onClick={changeToEdit}>Red Strings</li>
                    <li data-cat='Paracord' onClick={changeToEdit}>Paracord</li>
                    <li data-cat='Wooden' onClick={changeToEdit}>Wooden</li>
                    <li data-cat='Friendship' onClick={changeToEdit}>Friendship </li>
                    <li data-cat='Oranaments' onClick={changeToEdit}>Ornaments</li>
                </ul>
                </li>
                <li className='nav-link' onClick={onLogout}>Log out <i className="fas fa-sign-out-alt"></i></li>
            </ul>

        </nav>
    )
}

export default Sidebar
