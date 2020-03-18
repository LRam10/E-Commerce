import React,{useContext} from 'react';
import { Link } from 'react-router-dom';
import ItemContext from '../../context/item/itemContext';


const Item= ({item})=> {
    const {img_url,category,price,name} = item
    const itemContext = useContext(ItemContext);

    const onSetItem = ()=>{
        itemContext.setCurrentItem(item);
    }
    return (
            <div className='card'>
                <Link to={`/item/${item.name}`} onClick={onSetItem}>
                <img src={img_url} className='card-img-top' alt={`${category}-pic`}/></Link>
                <div className='card-body card-container bg-light'>
                    <p className='text-center m-0'><small>{name}</small></p>
                    <p className='text-center m-0'><b>${price}</b></p>
                </div>
            </div>
    )
}

export default Item
