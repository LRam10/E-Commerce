import React,{useState,useContext} from 'react'
import CreateItem from '../Admin/CreateItem';
import DeleteEditItems from '../Admin/DeleteEditItem';
import Sidebar from '../Admin/Sidebar';

import ItemContext from '../../context/item/itemContext';
const Admin = () => {
    const [active,setActive] = useState(true);
    const itemContext = useContext(ItemContext);
    const {items} = itemContext;

    const toggle = (section,data)=>{
        if(data == ' '){
            setActive(section);
            return;
        }
        setActive(section);
        console.log(data);
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
