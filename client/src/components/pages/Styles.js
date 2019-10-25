import React,{Fragment,useContext} from 'react'
import Items from '../Items/Items'
import ItemContext from '../../context/item/itemContext';
import {useParams} from 'react-router-dom'
const Styles = ()=> {
    let{style} = useParams()
    const itemContext = useContext(ItemContext);
    const {items} = itemContext;
    return (
        <Fragment>
            <h4>{style}</h4> 
           <div className="container-fluid">
           <Items items={items}/>
            </div> 
        </Fragment>
    )
}

export default Styles
