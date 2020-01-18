import React,{Fragment,useContext,useEffect} from 'react'
import Items from '../Items/Items'
import Search from '../helpers/Searchbar';
import ItemContext from '../../context/item/itemContext';
import AuthContext from '../../context/auth/authContext'
import {useParams} from 'react-router-dom';
import {useExpiration} from '../../utils/useExpiration';

const Styles = ()=> {
    let{style} = useParams();
    //ItemContext 
    const cat_text = style.replace('_',' ');
    const itemContext = useContext(ItemContext);
    const {items,getItems,loading,filter} = itemContext;
    //AuthContext
    const authContext = useContext(AuthContext);
    const {loadUser} = authContext;
    useEffect(()=>{
        getItems(style);
        if(localStorage.token){
        loadUser();
        };
        //eslint-disable-next-line
    },[style])
    //Update cart for logged in user
        useExpiration()
    return (
        <Fragment>
            <div className='jumbotron'>
                <h2 className='text-center text-uppercase'><u>{cat_text}</u></h2> 
                <Search/>
            </div>
           <div className="container-fluid">
            {filter !== null 
            ? <Items items={filter}/>:
            <Items items={items} loading={loading}/>} 
           
            </div> 
        </Fragment>
    )
}

export default Styles;