import React,{Fragment,useContext,useEffect} from 'react'
import Items from '../Items/Items'
import ItemContext from '../../context/item/itemContext';
import AuthContext from '../../context/auth/authContext'
import {useParams} from 'react-router-dom';
import {useExpiration} from '../../utils/useExpiration';

const Styles = ()=> {
    let{style} = useParams();
    //ItemContext 
    const itemContext = useContext(ItemContext);
    const {items,getItems} = itemContext;
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
            <h4 className='text-center'>{style}</h4> 
           <div className="container-fluid">
           <Items items={items}/>
            </div> 
        </Fragment>
    )
}

export default Styles
