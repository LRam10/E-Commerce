import React,{Fragment,useContext,useEffect} from 'react'
import Items from '../Items/Items'
import Search from '../helpers/Searchbar';
import ItemContext from '../../context/item/itemContext';
import AuthContext from '../../context/auth/authContext'
import {useExpiration} from '../../utils/useExpiration';

const Styles = (props)=> {
    const {category_name,img_url} = props.location.state;
    //ItemContext 
    const cat_text = category_name.replace('-',' ');
    const itemContext = useContext(ItemContext);
    const {items,getItems,loading,filter} = itemContext;
    //AuthContext
    const authContext = useContext(AuthContext);
    const {loadUser} = authContext;
    useEffect(()=>{
        getItems(category_name);
        if(localStorage.token){
        loadUser();
        };
        //eslint-disable-next-line
    },[category_name])
    //Update cart for logged in user
        useExpiration()
    return (
        <Fragment>
            <div className='jumbotron' style={{background:`url(${img_url}) no-repeat center`}}>
                <h2 className='text-center text-uppercase text-white font-weight-bold'><u>{cat_text}</u></h2> 
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