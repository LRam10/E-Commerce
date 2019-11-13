import React,{useState,useContext,useEffect} from 'react'
import CreateItem from '../Admin/CreateItem';
import DeleteEditItems from '../Admin/DeleteEditItem';
import Sidebar from '../Admin/Sidebar';

import ItemContext from '../../context/item/itemContext';
import AuthContext from '../../context/auth/authContext';
const Admin = () => {
    const [active,setActive] = useState(true);
    const itemContext = useContext(ItemContext);
    const {items,getItems} = itemContext;
    const authContext = useContext(AuthContext);
    useEffect(()=>{
        authContext.loadUser();
        //eslint-disable-next-line
    }, []);
    //switch between components
    const toggle = (section,data)=>{
        if(data === ' '){
            setActive(section);
            return;
        }
        setActive(section);
        getItems(data);
    }
    return (
        <div className='container-fluid'>
            <div className='row' style={{padding:'0'}}>
                <div className='col-md-2' style={{padding:'0'}}>
                <Sidebar toggle={toggle}/>
                </div>
                <div className='col-lg-10' style={scrolly}>
                    {active ? <CreateItem/>:<DeleteEditItems items={items}/>}
                    
                </div>
            </div>
        </div>
    )
}
const scrolly ={
    overflowY:'auto',
    height:'600px'
}

export default Admin
